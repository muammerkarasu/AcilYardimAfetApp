import {firebase} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

/**
 * Firebase konfigürasyonu
 * Not: google-services.json ve GoogleService-Info.plist dosyaları
 * ilgili platformlara eklendiğinde otomatik olarak yapılandırılır
 *
 * Ancak bazı durumlarda manuel olarak da aşağıdaki gibi belirtmek gerekebilir
 */
const firebaseConfig = {
  apiKey: 'AIzaSyApF0pg8BQ-9lysamw3aXv_wLAr_1B255s',
  authDomain: 'afetyardim-2acc9.firebaseapp.com',
  projectId: 'afetyardim-2acc9',
  storageBucket: 'afetyardim-2acc9.appspot.com',
  messagingSenderId: '158664988587',
  appId: '1:158664988587:android:7867ee5b2e5713c1a0e4ee',
  databaseURL: 'https://afetyardim-2acc9-default-rtdb.firebaseio.com',
};

// Firebase'in başlatılıp başlatılmadığını kontrol et
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Realtime Database için varsayılan URL'yi ayarla
if (firebase.app().database) {
  firebase.app().database().setPersistenceEnabled(true); // Offline veritabanı desteği
}

// Hata ayıklama modu - geliştirme sırasında yararlı
if (__DEV__) {
  console.log('Firebase yapılandırıldı:', firebase.app().name);
}

export {firebase, auth, database};
