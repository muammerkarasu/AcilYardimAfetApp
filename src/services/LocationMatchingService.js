import { firebase } from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission, checkLocationServices } from '../utils/permissions';

class LocationMatchingService {
  // Haversine formülü ile iki konum arasındaki mesafeyi hesaplar (km cinsinden)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Mesafe (km)
    return distance;
  }

  // Dereceyi radyana çevirir
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Kullanıcının mevcut konumunu alır
  async getCurrentLocation() {
    const hasPermission = await requestLocationPermission();
    const isLocationEnabled = await checkLocationServices();

    if (!hasPermission || !isLocationEnabled) {
      throw new Error('Konum izni veya servisleri etkin değil');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  // Belirli bir mesafe içindeki yardım taleplerini getirir
  async getHelpRequestsWithinRadius(radius = 10) {
    try {
      const userLocation = await this.getCurrentLocation();
      
      // Firestore'dan tüm aktif yardım taleplerini al
      const helpRequestsSnapshot = await firebase.firestore()
        .collection('helpRequests')
        .where('status', '==', 'active')
        .get();

      if (helpRequestsSnapshot.empty) {
        return [];
      }

      // Her bir yardım talebi için mesafeyi hesapla ve filtreleme yap
      const helpRequestsWithDistance = [];
      
      helpRequestsSnapshot.forEach(doc => {
        const helpRequest = doc.data();
        const helpRequestLocation = helpRequest.location;
        
        if (helpRequestLocation && helpRequestLocation.latitude && helpRequestLocation.longitude) {
          const distance = this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            helpRequestLocation.latitude,
            helpRequestLocation.longitude
          );
          
          // Sadece belirtilen yarıçap içindeki talepleri ekle
          if (distance <= radius) {
            helpRequestsWithDistance.push({
              id: doc.id,
              ...helpRequest,
              distance: distance.toFixed(1) // Mesafeyi 1 ondalık basamakla yuvarla
            });
          }
        }
      });

      // Mesafeye göre sırala (en yakın önce)
      return helpRequestsWithDistance.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Yakındaki yardım talepleri alınırken hata:', error);
      throw error;
    }
  }

  // Gönüllünün becerilerine göre yardım taleplerini filtreler
  async getMatchingHelpRequests(volunteerSkills, radius = 10) {
    try {
      const nearbyRequests = await this.getHelpRequestsWithinRadius(radius);
      
      // Gönüllünün becerilerine göre filtreleme yap
      const matchingRequests = nearbyRequests.filter(request => {
        // Eğer talep belirli bir beceri gerektirmiyorsa, herkes yardım edebilir
        if (!request.requiredSkills || request.requiredSkills.length === 0) {
          return true;
        }
        
        // Gönüllünün en az bir becerisi talep edilen becerilerle eşleşiyorsa
        return request.requiredSkills.some(skill => 
          volunteerSkills.includes(skill)
        );
      });
      
      return matchingRequests;
    } catch (error) {
      console.error('Eşleşen yardım talepleri alınırken hata:', error);
      throw error;
    }
  }

  // Aciliyet durumuna göre yardım taleplerini sıralar
  sortByPriority(helpRequests) {
    // Öncelik sıralaması: critical > high > medium > low
    const priorityOrder = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };
    
    return [...helpRequests].sort((a, b) => {
      // Önce aciliyet durumuna göre sırala
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // Aciliyet aynıysa, mesafeye göre sırala
      return a.distance - b.distance;
    });
  }

  // Gönüllü için en uygun yardım taleplerini getirir
  async getBestMatchesForVolunteer(volunteerId, maxResults = 10) {
    try {
      // Gönüllü bilgilerini al
      const volunteerDoc = await firebase.firestore()
        .collection('volunteers')
        .doc(volunteerId)
        .get();
      
      if (!volunteerDoc.exists) {
        throw new Error('Gönüllü bulunamadı');
      }
      
      const volunteerData = volunteerDoc.data();
      const volunteerSkills = volunteerData.skills || [];
      const maxDistance = volunteerData.maxTravelDistance || 10; // Varsayılan 10km
      
      // Beceri ve mesafeye göre eşleşen talepleri al
      let matchingRequests = await this.getMatchingHelpRequests(volunteerSkills, maxDistance);
      
      // Aciliyet durumuna göre sırala
      matchingRequests = this.sortByPriority(matchingRequests);
      
      // Maksimum sonuç sayısına göre kırp
      return matchingRequests.slice(0, maxResults);
    } catch (error) {
      console.error('Gönüllü için en iyi eşleşmeler alınırken hata:', error);
      throw error;
    }
  }
}

export default new LocationMatchingService();