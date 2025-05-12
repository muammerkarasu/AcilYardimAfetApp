import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import Routes from './src/routes';

import React, { useEffect } from 'react';
import NotificationService from './src/services/NotificationService';

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Bildirim izinlerini iste
      const hasPermission = await NotificationService.requestPermission();
      
      if (hasPermission) {
        // FCM token'ı al ve kaydet
        await NotificationService.getFCMToken();
        
        // Bildirim dinleyicilerini ayarla
        const unsubscribeForeground = NotificationService.setupForegroundNotificationListener();
        NotificationService.setupBackgroundNotificationListener();
        
        return () => {
          unsubscribeForeground();
        };
      }
    };
    
    setupNotifications();
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;