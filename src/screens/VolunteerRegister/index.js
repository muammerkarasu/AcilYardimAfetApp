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
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';

const VolunteerRegister = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState('anytime'); // anytime, weekdays, weekends
  const [travelDistance, setTravelDistance] = useState('5'); // in km
  const [hasVehicle, setHasVehicle] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  
  // Tüm beceri seçenekleri
  const skillOptions = [
    { id: 'medical', label: 'Tıbbi Yardım', icon: 'medical-bag' },
    { id: 'search_rescue', label: 'Arama Kurtarma', icon: 'lifebuoy' },
    { id: 'transportation', label: 'Ulaşım', icon: 'car' },
    { id: 'food', label: 'Gıda Dağıtımı', icon: 'food' },
    { id: 'shelter', label: 'Barınma Desteği', icon: 'home' },
    { id: 'childcare', label: 'Çocuk Bakımı', icon: 'human-male-child' },
    { id: 'eldercare', label: 'Yaşlı Bakımı', icon: 'human-cane' },
    { id: 'translation', label: 'Tercümanlık', icon: 'translate' },
    { id: 'construction', label: 'İnşaat/Tamir', icon: 'hammer' },
    { id: 'tech', label: 'Teknik Destek', icon: 'laptop' },
    { id: 'psychological', label: 'Psikolojik Destek', icon: 'brain' },
    { id: 'communication', label: 'İletişim', icon: 'cellphone' },
    { id: 'logistics', label: 'Lojistik', icon: 'truck' },
  ];
  
  // Maksimum seyahat mesafesi seçenekleri
  const travelDistanceOptions = [
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '20', label: '20 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
  ];
  
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  const getCurrentLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude,
          longitude,
        };
        
        try {
          // Here you would normally use a geocoding service to get the address
          // For simplicity, we'll just use coordinates
          setLocation(locationData);
          setLocationAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } catch (error) {
          console.error('Error getting location address:', error);
        } finally {
          setLocationLoading(false);
        }
      },
      error => {
        console.error('Error getting current location:', error);
        setLocationLoading(false);
        Alert.alert('Hata', 'Konum bilgisi alınamadı. Lütfen konum izinlerini kontrol edin.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  const toggleSkill = (skillId) => {
    if (skills.includes(skillId)) {
      setSkills(skills.filter(id => id !== skillId));
    } else {
      setSkills([...skills, skillId]);
    }
  };
  
  const handleSubmit = async () => {
    if (!fullName || !phone || skills.length === 0 || !location) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Hata', 'Oturum açmanız gerekiyor.');
      return;
    }
    
    setLoading(true);
    try {
      const volunteerData = {
        userId: currentUser.uid,
        email: currentUser.email,
        fullName,
        phone,
        skills,
        availability,
        travelDistance: parseInt(travelDistance, 10),
        hasVehicle,
        emergencyContact,
        location,
        locationAddress,
        status: 'active',
        createdAt: firestore.FieldValue.serverTimestamp(),
        maxTravelDistance: parseInt(travelDistance, 10), // Maksimum seyahat mesafesi
      };
      
      // Check if volunteer profile already exists
      const volunteerDoc = await firestore()
        .collection('volunteers')
        .where('userId', '==', currentUser.uid)
        .get();
      
      if (!volunteerDoc.empty) {
        // Update existing profile
        await firestore()
          .collection('volunteers')
          .doc(volunteerDoc.docs[0].id)
          .update(volunteerData);
      } else {
        // Create new profile
        await firestore().collection('volunteers').add(volunteerData);
      }
      
      // Update user profile with volunteer status
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
          isVolunteer: true,
        });
      
      Alert.alert(
        'Başarılı',
        'Gönüllü kaydınız başarıyla tamamlandı.',
        [{ text: 'Tamam', onPress: () => navigation.navigate('VolunteerDashboard') }]
      );
    } catch (error) {
      console.error('Error registering volunteer:', error);
      Alert.alert('Hata', 'Gönüllü kaydı oluşturulurken bir hata oluştu.');
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
        <Text style={styles.headerTitle}>Gönüllü Kaydı</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Adınız ve soyadınız"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Telefon numaranız"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Acil Durum İletişim Bilgisi (İsteğe Bağlı)</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Acil durumda aranacak kişi ve telefonu"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Beceriler ve Uzmanlıklar</Text>
          <Text style={styles.sectionDescription}>
            Afet durumlarında hangi konularda yardım edebilirsiniz?
          </Text>
          
          <View style={styles.skillsContainer}>
            {skillOptions.map(skill => (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillButton,
                  skills.includes(skill.id) && styles.activeSkillButton,
                ]}
                onPress={() => toggleSkill(skill.id)}
              >
                <Icon
                  name={skill.icon}
                  size={24}
                  color={skills.includes(skill.id) ? 'white' : '#1e3c72'}
                />
                <Text
                  style={[
                    styles.skillText,
                    skills.includes(skill.id) && styles.activeSkillText,
                  ]}
                >
                  {skill.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Uygunluk ve Ulaşım</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Uygunluk Zamanı</Text>
            <View style={styles.availabilityContainer}>
              <TouchableOpacity
                style={[
                  styles.availabilityButton,
                  availability === 'anytime' && styles.activeAvailabilityButton,
                ]}
                onPress={() => setAvailability('anytime')}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    availability === 'anytime' && styles.activeAvailabilityText,
                  ]}
                >
                  Her Zaman
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.availabilityButton,
                  availability === 'weekdays' && styles.activeAvailabilityButton,
                ]}
                onPress={() => setAvailability('weekdays')}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    availability === 'weekdays' && styles.activeAvailabilityText,
                  ]}
                >
                  Hafta İçi
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.availabilityButton,
                  availability === 'weekends' && styles.activeAvailabilityButton,
                ]}
                onPress={() => setAvailability('weekends')}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    availability === 'weekends' && styles.activeAvailabilityText,
                  ]}
                >
                  Hafta Sonu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seyahat Mesafesi (km)</Text>
            <View style={styles.travelDistanceContainer}>
              {travelDistanceOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.travelDistanceButton,
                    travelDistance === option.value && styles.activeTravelDistanceButton,
                  ]}
                  onPress={() => setTravelDistance(option.value)}
                >
                  <Text
                    style={[
                      styles.travelDistanceText,
                      travelDistance === option.value && styles.activeTravelDistanceText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Aracım var</Text>
            <Switch
              value={hasVehicle}
              onValueChange={setHasVehicle}
              trackColor={{ false: '#d1d1d1', true: '#1e3c72' }}
              thumbColor={hasVehicle ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Konum Bilgisi</Text>
          
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationText}>
                {locationAddress || 'Konum bilgisi alınamadı'}
              </Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#1e3c72" />
                ) : (
                  <Icon name="crosshairs-gps" size={24} color="#1e3c72" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.locationDescription}>
              Konumunuz, size yakın yardım çağrılarını eşleştirmek için kullanılacaktır.
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Gönüllü Kaydını Tamamla</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VolunteerRegister;
