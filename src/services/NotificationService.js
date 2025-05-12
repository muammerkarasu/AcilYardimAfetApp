import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  // Bildirim izinlerini iste
  async requestPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        console.log('Bildirim izni verildi');
        return true;
      }
      
      console.log('Bildirim izni reddedildi');
      return false;
    } catch (error) {
      console.error('Bildirim izni istenirken hata:', error);
      return false;
    }
  }

  // FCM token'ı al ve kaydet
  async getFCMToken() {
    try {
      // Mevcut token'ı kontrol et
      const savedToken = await AsyncStorage.getItem('fcmToken');
      
      // Yeni token al
      const fcmToken = await messaging().getToken();
      
      // Token değiştiyse güncelle
      if (savedToken !== fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        await this.saveFCMTokenToFirestore(fcmToken);
      }
      
      return fcmToken;
    } catch (error) {
      console.error('FCM token alınırken hata:', error);
      return null;
    }
  }

  // Token'ı Firestore'a kaydet
  async saveFCMTokenToFirestore(token) {
    try {
      const currentUser = firebase.auth().currentUser;
      
      if (!currentUser) {
        console.log('Kullanıcı oturum açmamış, token kaydedilemiyor');
        return;
      }
      
      // Kullanıcı belgesini güncelle
      await firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
          fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
        });
      
      // Eğer kullanıcı gönüllüyse, gönüllü belgesini de güncelle
      const volunteerSnapshot = await firebase.firestore()
        .collection('volunteers')
        .where('userId', '==', currentUser.uid)
        .limit(1)
        .get();
      
      if (!volunteerSnapshot.empty) {
        await firebase.firestore()
          .collection('volunteers')
          .doc(volunteerSnapshot.docs[0].id)
          .update({
            fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
          });
      }
      
      console.log('FCM token başarıyla kaydedildi');
    } catch (error) {
      console.error('FCM token kaydedilirken hata:', error);
    }
  }

  // Ön planda bildirim dinleyicisini ayarla
  setupForegroundNotificationListener() {
    return messaging().onMessage(async remoteMessage => {
      console.log('Ön planda bildirim alındı:', remoteMessage);
      // Burada özel bildirim gösterme işlemi yapabilirsiniz
    });
  }

  // Arka planda bildirim tıklama dinleyicisini ayarla
  setupBackgroundNotificationListener() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Arka planda bildirim tıklandı:', remoteMessage);
      // Burada bildirime tıklandığında yapılacak işlemleri tanımlayabilirsiniz
    });

    // Uygulama kapalıyken açılan bildirimleri kontrol et
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Uygulama kapalıyken bildirim tıklandı:', remoteMessage);
          // Burada bildirime tıklandığında yapılacak işlemleri tanımlayabilirsiniz
        }
      });
  }
}

export default new NotificationService();