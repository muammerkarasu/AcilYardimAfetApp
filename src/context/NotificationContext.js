import React, { createContext, useState, useContext, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Kullanıcı oturum açtığında FCM token'ı kaydet
      NotificationService.registerUserToken(user.uid);
      
      // Kullanıcının konumuna göre bölgesel bildirimlere abone ol
      if (user.location) {
        const region = user.location.region || 'general';
        NotificationService.subscribeToTopic(`region_${region}`);
      }
      
      // Kullanıcı gönüllü ise gönüllü bildirimlerine abone ol
      if (user.isVolunteer) {
        NotificationService.subscribeToTopic('volunteers');
      }
      
      // Kullanıcının bildirimlerini yükle
      loadNotifications();
    }
    
    return () => {
      // Temizlik işlemleri
      if (user) {
        if (user.location) {
          const region = user.location.region || 'general';
          NotificationService.unsubscribeFromTopic(`region_${region}`);
        }
        
        if (user.isVolunteer) {
          NotificationService.unsubscribeFromTopic('volunteers');
        }
      }
    };
  }, [user]);

  // Kullanıcının bildirimlerini yükle
  const loadNotifications = async () => {
    try {
      if (!user) return;
      
      const firestore = require('@react-native-firebase/firestore').default;
      const notificationsSnapshot = await firestore()
        .collection('notifications')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
      
      const notificationsList = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setNotifications(notificationsList);
      
      // Okunmamış bildirimleri say
      const unread = notificationsList.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
    }
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (notificationId) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore()
        .collection('notifications')
        .doc(notificationId)
        .update({
          read: true,
          readAt: firestore.FieldValue.serverTimestamp(),
        });
      
      // Yerel durumu güncelle
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Okunmamış sayısını güncelle
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error);
    }
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = async () => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const batch = firestore().batch();
      
      // Okunmamış bildirimleri bul
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      // Toplu güncelleme için batch kullan
      unreadIds.forEach(id => {
        const ref = firestore().collection('notifications').doc(id);
        batch.update(ref, {
          read: true,
          readAt: firestore.FieldValue.serverTimestamp(),
        });
      });
      
      await batch.commit();
      
      // Yerel durumu güncelle
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      // Okunmamış sayısını sıfırla
      setUnreadCount(0);
    } catch (error) {
      console.error('Tüm bildirimler okundu işaretlenirken hata:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};