/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/routes';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee from '@react-native-community/notifee';

AppRegistry.registerComponent(appName, () => App);

// Bildirim kanalı oluştur
async function createNotificationChannels() {
  // Yardım talepleri için kanal
  await notifee.createChannel({
    id: 'help-requests',
    name: 'Yardım Talepleri',
    description: 'Yardım talepleri ile ilgili bildirimler',
    importance: 5, // Yüksek önem
    sound: 'default',
    vibration: true,
    lights: true,
  });

  // Durum güncellemeleri için kanal
  await notifee.createChannel({
    id: 'status-updates',
    name: 'Durum Güncellemeleri',
    description: 'Yardım talebi durum güncellemeleri',
    importance: 4, // Orta önem
    sound: 'default',
    vibration: true,
  });
}

// Arka plan mesaj işleyicisi
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Arka planda mesaj alındı:', remoteMessage);
  
  // Bildirim göster
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId: remoteMessage.data?.type === 'help_request' ? 'help-requests' : 'status-updates',
      smallIcon: 'ic_notification',
      color: '#1e3c72',
      pressAction: {
        id: 'default',
      },
    },
  });
});

// Uygulama başlatıldığında bildirim kanallarını oluştur
createNotificationChannels();
