import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const CreateHelpRequest = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  const getCurrentLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        getAddressFromCoordinates(latitude, longitude);
      },
      error => {
        console.log('Error getting current location:', error);
        setLocationLoading(false);
        Alert.alert('Hata', 'Konum bilgisi alınamadı. Lütfen konum izinlerini kontrol edin.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Burada gerçek bir adres çözümleme servisi kullanabilirsiniz
      // Şimdilik basit bir adres oluşturuyoruz
      setAddress(`Enlem: ${latitude.toFixed(6)}, Boylam: ${longitude.toFixed(6)}`);
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setLocationLoading(false);
    }
  };
  
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
    getAddressFromCoordinates(coordinate.latitude, coordinate.longitude);
  };
  
  const handleSubmit = async () => {
    if (!title || !description || !requestType || !location) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Hata', 'Oturum açmanız gerekiyor.');
      return;
    }
    
    setLoading(true);
    try {
      const helpRequest = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'İsimsiz Kullanıcı',
        title,
        description,
        requestType,
        urgency,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address,
        },
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      await firestore().collection('helpRequests').add(helpRequest);
      
      Alert.alert(
        'Başarılı',
        'Yardım çağrınız başarıyla oluşturuldu.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error creating help request:', error);
      Alert.alert('Hata', 'Yardım çağrısı oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yardım Çağrısı Oluştur</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Çağrı Bilgileri</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Başlık</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Yardım çağrınız için kısa bir başlık"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Yardım ihtiyacınızı detaylı olarak açıklayın"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Yardım Türü</Text>
          
          <View style={styles.requestTypeContainer}>
            <TouchableOpacity
              style={[
                styles.requestTypeButton,
                requestType === 'food' && styles.activeRequestTypeButton,
              ]}
              onPress={() => setRequestType('food')}
            >
              <Icon
                name="food"
                size={24}
                color={requestType === 'food' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.requestTypeText,
                  requestType === 'food' && styles.activeRequestTypeText,
                ]}
              >
                Gıda
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.requestTypeButton,
                requestType === 'shelter' && styles.activeRequestTypeButton,
              ]}
              onPress={() => setRequestType('shelter')}
            >
              <Icon
                name="home"
                size={24}
                color={requestType === 'shelter' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.requestTypeText,
                  requestType === 'shelter' && styles.activeRequestTypeText,
                ]}
              >
                Barınma
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.requestTypeButton,
                requestType === 'medical' && styles.activeRequestTypeButton,
              ]}
              onPress={() => setRequestType('medical')}
            >
              <Icon
                name="medical-bag"
                size={24}
                color={requestType === 'medical' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.requestTypeText,
                  requestType === 'medical' && styles.activeRequestTypeText,
                ]}
              >
                Tıbbi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.requestTypeButton,
                requestType === 'clothing' && styles.activeRequestTypeButton,
              ]}
              onPress={() => setRequestType('clothing')}
            >
              <Icon
                name="tshirt-crew"
                size={24}
                color={requestType === 'clothing' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.requestTypeText,
                  requestType === 'clothing' && styles.activeRequestTypeText,
                ]}
              >
                Giyim
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.requestTypeButton,
                requestType === 'other' && styles.activeRequestTypeButton,
              ]}
              onPress={() => setRequestType('other')}
            >
              <Icon
                name="help-circle"
                size={24}
                color={requestType === 'other' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.requestTypeText,
                  requestType === 'other' && styles.activeRequestTypeText,
                ]}
              >
                Diğer
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Aciliyet Durumu</Text>
          
          <View style={styles.urgencyContainer}>
            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === 'low' && styles.lowUrgencyButton,
              ]}
              onPress={() => setUrgency('low')}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  urgency === 'low' && styles.activeUrgencyButtonText,
                ]}
              >
                Düşük
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === 'normal' && styles.normalUrgencyButton,
              ]}
              onPress={() => setUrgency('normal')}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  urgency === 'normal' && styles.activeUrgencyButtonText,
                ]}
              >
                Normal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === 'high' && styles.highUrgencyButton,
              ]}
              onPress={() => setUrgency('high')}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  urgency === 'high' && styles.activeUrgencyButtonText,
                ]}
              >
                Yüksek
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Konum</Text>
          
          {locationLoading ? (
            <View style={styles.mapPlaceholder}>
              <ActivityIndicator size="large" color="#1e3c72" />
              <Text style={styles.loadingText}>Konum alınıyor...</Text>
            </View>
          ) : (
            <>
              <View style={styles.mapContainer}>
                {location && (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    onPress={handleMapPress}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      title="Yardım Konumu"
                    />
                  </MapView>
                )}
              </View>
              
              <View style={styles.addressContainer}>
                <Icon name="map-marker" size={20} color="#1e3c72" />
                <Text style={styles.addressText}>{address}</Text>
              </View>
              
              <Text style={styles.mapInstructions}>
                Konumu değiştirmek için harita üzerinde istediğiniz noktaya dokunun.
              </Text>
            </>
          )}
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Yardım Çağrısı Oluştur</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateHelpRequest;