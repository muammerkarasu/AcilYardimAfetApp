import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import LocationMatchingService from '../../services/LocationMatchingService';
import { useAuth } from '../../context/AuthContext'; // Auth context'inizi import edin
import styles from './styles';

const VolunteerDashboard = ({ navigation }) => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth(); // Kullanıcı bilgisini auth context'ten alın

  // Yardım taleplerini yükle
  const loadHelpRequests = async () => {
    try {
      setLoading(true);
      
      // Gönüllü için en uygun eşleşmeleri al
      const matches = await LocationMatchingService.getBestMatchesForVolunteer(user.uid);
      setHelpRequests(matches);
    } catch (error) {
      console.error('Yardım talepleri yüklenirken hata:', error);
      Alert.alert('Hata', 'Yardım talepleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Yardım talebini kabul et
  const acceptHelpRequest = async (requestId) => {
    try {
      // Firestore'da yardım talebini güncelle
      await firebase.firestore()
        .collection('helpRequests')
        .doc(requestId)
        .update({
          status: 'assigned',
          assignedVolunteerId: user.uid,
          assignedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      // Gönüllünün aktif görevlerine ekle
      await firebase.firestore()
        .collection('volunteers')
        .doc(user.uid)
        .update({
          activeRequests: firebase.firestore.FieldValue.arrayUnion(requestId)
        });

      Alert.alert('Başarılı', 'Yardım talebi kabul edildi.');
      
      // Listeyi yenile
      loadHelpRequests();
    } catch (error) {
      console.error('Yardım talebi kabul edilirken hata:', error);
      Alert.alert('Hata', 'Yardım talebi kabul edilirken bir hata oluştu.');
    }
  };

  // Yardım talebi detaylarını görüntüle
  const viewHelpRequestDetails = (request) => {
    navigation.navigate('HelpRequestDetail', { request });
  };

  // Yenileme işlemi
  const handleRefresh = () => {
    setRefreshing(true);
    loadHelpRequests();
  };

  // Sayfa yüklendiğinde ve kullanıcı değiştiğinde yardım taleplerini yükle
  useEffect(() => {
    if (user) {
      loadHelpRequests();
    }
  }, [user]);

  // Yardım talebi kartı
  const renderHelpRequestItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.requestCard}
      onPress={() => viewHelpRequestDetails(item)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <View style={[styles.priorityBadge, styles[`priority${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}`]]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.requestInfo}>
        <Text style={styles.distanceText}>{item.distance} km uzaklıkta</Text>
        <Text style={styles.timeText}>
          {new Date(item.createdAt.toDate()).toLocaleString('tr-TR')}
        </Text>
      </View>
      
      <View style={styles.skillsContainer}>
        {item.requiredSkills && item.requiredSkills.map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => acceptHelpRequest(item.id)}
      >
        <Text style={styles.acceptButtonText}>Yardım Et</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yakındaki Yardım Talepleri</Text>
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : helpRequests.length > 0 ? (
        <FlatList
          data={helpRequests}
          renderItem={renderHelpRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Yakınınızda yardım talebi bulunmuyor veya becerilerinize uygun talep yok.
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>Yenile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default VolunteerDashboard;