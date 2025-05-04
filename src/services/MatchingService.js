import { firebase } from '@react-native-firebase/firestore';
import { getDistance } from 'geolib';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MatchingService {
  constructor() {
    this.db = firebase.firestore();
    this.helpRequestsRef = this.db.collection('helpRequests');
    this.volunteersRef = this.db.collection('volunteers');
  }

  // Gönüllünün konumuna göre en yakın yardım taleplerini bulma
  async findNearbyHelpRequests(volunteerLocation, maxDistance = 20000, limit = 10) {
    try {
      // Tüm aktif yardım taleplerini al
      const snapshot = await this.helpRequestsRef
        .where('status', '==', 'active')
        .get();

      if (snapshot.empty) {
        return [];
      }

      // Yardım taleplerini mesafeye göre filtrele ve sırala
      let helpRequests = [];
      snapshot.forEach(doc => {
        const helpRequest = { id: doc.id, ...doc.data() };
        
        // Yardım talebinin konumu varsa mesafeyi hesapla
        if (helpRequest.location && helpRequest.location.latitude && helpRequest.location.longitude) {
          const distance = getDistance(
            { latitude: volunteerLocation.latitude, longitude: volunteerLocation.longitude },
            { latitude: helpRequest.location.latitude, longitude: helpRequest.location.longitude }
          );
          
          // Maksimum mesafe içindeyse listeye ekle
          if (distance <= maxDistance) {
            helpRequests.push({
              ...helpRequest,
              distance: distance // metre cinsinden mesafe
            });
          }
        }
      });

      // Mesafeye göre sırala (en yakından en uzağa)
      helpRequests.sort((a, b) => a.distance - b.distance);
      
      // Limit uygula
      return helpRequests.slice(0, limit);
    } catch (error) {
      console.error('Yakındaki yardım talepleri bulunamadı:', error);
      return [];
    }
  }

  // Gönüllünün becerilerine göre yardım taleplerini filtreleme
  async findMatchingHelpRequestsBySkills(volunteerSkills, volunteerLocation, maxDistance = 20000) {
    try {
      // Önce yakındaki tüm yardım taleplerini bul
      const nearbyRequests = await this.findNearbyHelpRequests(volunteerLocation, maxDistance);
      
      if (nearbyRequests.length === 0) {
        return [];
      }

      // Beceri eşleşmesine göre filtreleme
      const matchingRequests = nearbyRequests.filter(request => {
        // Yardım talebinin gerektirdiği beceriler
        const requiredSkills = request.requiredSkills || [];
        
        // Gönüllünün becerileri ile yardım talebinin gerektirdiği becerilerin kesişimi
        const matchingSkills = volunteerSkills.filter(skill => 
          requiredSkills.includes(skill)
        );
        
        // En az bir beceri eşleşiyorsa, bu talebi listeye ekle
        return matchingSkills.length > 0;
      });

      // Eşleşme puanına göre sıralama
      return matchingRequests.map(request => {
        const requiredSkills = request.requiredSkills || [];
        const matchingSkillsCount = volunteerSkills.filter(skill => 
          requiredSkills.includes(skill)
        ).length;
        
        // Eşleşme puanı: beceri eşleşme oranı ve mesafe kombinasyonu
        const skillMatchRatio = matchingSkillsCount / requiredSkills.length;
        const distanceScore = 1 - (request.distance / maxDistance); // Mesafe puanı (0-1 arası)
        
        // Toplam puan (beceri eşleşmesi %70, mesafe %30 ağırlıklı)
        const totalScore = (skillMatchRatio * 0.7) + (distanceScore * 0.3);
        
        return {
          ...request,
          matchScore: totalScore,
          matchingSkillsCount
        };
      }).sort((a, b) => b.matchScore - a.matchScore); // Yüksek puandan düşüğe sırala
    } catch (error) {
      console.error('Beceri eşleşmesi yapılırken hata oluştu:', error);
      return [];
    }
  }

  // Aciliyet durumuna göre yardım taleplerini sıralama
  sortByUrgency(helpRequests) {
    // Aciliyet seviyelerine göre ağırlıklar
    const urgencyWeights = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      normal: 1
    };

    return [...helpRequests].sort((a, b) => {
      const urgencyA = a.urgency ? urgencyWeights[a.urgency] || 1 : 1;
      const urgencyB = b.urgency ? urgencyWeights[b.urgency] || 1 : 1;
      
      // Önce aciliyet seviyesine göre sırala
      if (urgencyA !== urgencyB) {
        return urgencyB - urgencyA;
      }
      
      // Aciliyet seviyeleri aynıysa, mesafeye göre sırala
      return a.distance - b.distance;
    });
  }

  // Gönüllü için en uygun yardım taleplerini bulma (ana algoritma)
  async findOptimalHelpRequests(volunteerId) {
    try {
      // Gönüllü bilgilerini al
      const volunteerDoc = await this.volunteersRef.doc(volunteerId).get();
      
      if (!volunteerDoc.exists) {
        throw new Error('Gönüllü bulunamadı');
      }
      
      const volunteer = volunteerDoc.data();
      
      // Gönüllünün konumu ve becerileri
      const volunteerLocation = volunteer.location;
      const volunteerSkills = volunteer.skills || [];
      const maxDistance = volunteer.maxTravelDistance || 20000; // Varsayılan 20km
      
      if (!volunteerLocation || !volunteerLocation.latitude || !volunteerLocation.longitude) {
        throw new Error('Gönüllü konum bilgisi eksik');
      }
      
      // Beceri eşleşmesine göre yardım taleplerini bul
      let matchingRequests = await this.findMatchingHelpRequestsBySkills(
        volunteerSkills, 
        volunteerLocation,
        maxDistance
      );
      
      // Aciliyet durumuna göre sırala
      matchingRequests = this.sortByUrgency(matchingRequests);
      
      // Son eşleştirmeleri kaydet
      await AsyncStorage.setItem(
        `lastMatches_${volunteerId}`, 
        JSON.stringify(matchingRequests)
      );
      
      return matchingRequests;
    } catch (error) {
      console.error('Optimal yardım talepleri bulunurken hata oluştu:', error);
      Alert.alert(
        'Hata',
        'Yardım talepleri eşleştirilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'
      );
      return [];
    }
  }

  // Gönüllüyü yardım talebiyle eşleştirme
  async matchVolunteerWithRequest(volunteerId, requestId) {
    try {
      const batch = this.db.batch();
      
      // Yardım talebini güncelle
      const requestRef = this.helpRequestsRef.doc(requestId);
      batch.update(requestRef, {
        status: 'assigned',
        assignedVolunteerId: volunteerId,
        assignedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Gönüllü bilgilerini güncelle
      const volunteerRef = this.volunteersRef.doc(volunteerId);
      batch.update(volunteerRef, {
        activeRequests: firebase.firestore.FieldValue.arrayUnion(requestId),
        lastActiveAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // İşlemleri gerçekleştir
      await batch.commit();
      
      return true;
    } catch (error) {
      console.error('Eşleştirme yapılırken hata oluştu:', error);
      Alert.alert(
        'Hata',
        'Yardım talebi kabul edilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'
      );
      return false;
    }
  }
}

export default new MatchingService();