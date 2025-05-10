import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const HelpMap = () => {
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userType, setUserType] = useState('user'); // user, volunteer, authority

  useEffect(() => {
    getCurrentLocation();
    loadHelpRequests();
    checkUserType();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => Alert.alert('Hata', 'Konum alınamadı: ' + error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const checkUserType = async () => {
    // Firestore'dan kullanıcı tipini kontrol et
  };

  const loadHelpRequests = async () => {
    try {
      const snapshot = await firestore()
        .collection('helpRequests')
        .where('status', '==', 'active')
        .onSnapshot(querySnapshot => {
          const requests = [];
          querySnapshot.forEach(doc => {
            requests.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setHelpRequests(requests);
        });

      return () => snapshot();
    } catch (error) {
      Alert.alert('Hata', 'Yardım çağrıları yüklenirken bir hata oluştu');
    }
  };

  const handleMarkerPress = request => {
    if (userType === 'volunteer' || userType === 'authority') {
      Alert.alert(
        'Yardım Çağrısı',
        `${request.title}\n${request.description}`,
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Yardıma Git',
            onPress: () => acceptHelpRequest(request),
          },
        ],
      );
    }
  };

  const acceptHelpRequest = async request => {
    try {
      await firestore()
        .collection('helpRequests')
        .doc(request.id)
        .update({
          status: 'inProgress',
          helperId: auth().currentUser.uid,
          helperType: userType,
          acceptedAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Başarılı', 'Yardım çağrısı kabul edildi');
    } catch (error) {
      Alert.alert('Hata', 'Yardım çağrısı kabul edilirken bir hata oluştu');
    }
  };

  const getMarkerColor = urgency => {
    switch (urgency) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'red';
    }
  };

  const renderHelpRequestMarker = request => (
    <Marker
      key={request.id}
      coordinate={{
        latitude: request.location.latitude,
        longitude: request.location.longitude,
      }}
      pinColor={getMarkerColor(request.urgency)}
      onPress={() => handleMarkerPress(request)}>
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle}>{request.title}</Text>
          <Text style={styles.calloutUrgency}>
            Aciliyet: {
              request.urgency === 'high' ? 'Yüksek' :
              request.urgency === 'medium' ? 'Orta' : 'Düşük'
            }
          </Text>
          <Text style={styles.calloutDescription}>{request.description}</Text>
          <Text style={styles.calloutTime}>
            {new Date(request.createdAt.toDate()).toLocaleString('tr-TR')}
          </Text>
        </View>
      </Callout>
    </Marker>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}>
          <Text style={styles.filterText}>Tümü</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'high' && styles.activeFilter]}
          onPress={() => setSelectedFilter('high')}>
          <Text style={styles.filterText}>Acil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'medium' && styles.activeFilter]}
          onPress={() => setSelectedFilter('medium')}>
          <Text style={styles.filterText}>Orta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'low' && styles.activeFilter]}
          onPress={() => setSelectedFilter('low')}>
          <Text style={styles.filterText}>Düşük</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        {helpRequests
          .filter(request => selectedFilter === 'all' || request.urgency === selectedFilter)
          .map(request => renderHelpRequestMarker(request))}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={getCurrentLocation}>
        <Icon name="crosshairs-gps" size={24} color="#1e3c72" />
      </TouchableOpacity>
    </View>
  );
};

export default HelpMap;