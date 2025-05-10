import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

// Android için konum izni isteme
export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    try {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      return granted === 'granted';
    } catch (error) {
      console.error('iOS konum izni alınamadı:', error);
      return false;
    }
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni',
          message: 'Acil Yardım uygulaması, yakınınızdaki yardım taleplerini gösterebilmek için konum bilginize ihtiyaç duyuyor.',
          buttonNeutral: 'Daha Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Android konum izni alınamadı:', error);
      return false;
    }
  }

  return false;
};

// Konum servislerinin açık olup olmadığını kontrol etme
export const checkLocationServices = async () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        if (error.code === 2) {
          // Konum servisleri kapalı
          Alert.alert(
            'Konum Servisleri Kapalı',
            'Lütfen cihazınızın konum servislerini açın.',
            [{ text: 'Tamam', onPress: () => resolve(false) }],
            { cancelable: false }
          );
        } else {
          resolve(false);
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};