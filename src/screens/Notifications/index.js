import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNotification } from '../../context/NotificationContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const NotificationItem = ({ notification, onPress }) => {
  // Bildirim zamanını formatla
  const formattedTime = notification.createdAt 
    ? formatDistanceToNow(new Date(notification.createdAt.toDate()), { 
        addSuffix: true, 
        locale: tr 
      })
    : '';

  // Bildirim tipine göre simge belirle
  let iconName = 'bell';
  let iconColor = '#1e3c72';
  
  switch (notification.type) {
    case 'emergency':
      iconName = 'alert-circle';
      iconColor = '#e74c3c';
      break;
    case 'help_request':
      iconName = 'hand-heart';
      iconColor = '#3498db';
      break;
    case 'donation':
      iconName = 'gift';
      iconColor = '#2ecc71';
      break;
    case 'system':
      iconName = 'information';
      iconColor = '#f39c12';
      break;
  }

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationBody} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.notificationTime}>{formattedTime}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const Notifications = ({ navigation }) => {
  const { 
    notifications, 
    unreadCount, 
    loadNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotification();
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadNotifications();
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    // Bildirimi okundu olarak işaretle
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Bildirim tipine göre yönlendirme yap
    switch (notification.type) {
      case 'emergency':
        if (notification.data?.emergencyId) {
          navigation.navigate('EmergencyDetail', { 
            emergencyId: notification.data.emergencyId 
          });
        }
        break;
      case 'help_request':
        if (notification.data?.requestId) {
          navigation.navigate('HelpRequestDetail', { 
            requestId: notification.data.requestId 
          });
        }
        break;
      case 'donation':
        if (notification.data?.donationId) {
          navigation.navigate('DonationDetail', { 
            donationId: notification.data.donationId 
          });
        }
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirimler</Text>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Tümünü Okundu İşaretle</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#1e3c72" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem 
              notification={item} 
              onPress={handleNotificationPress} 
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#1e3c72']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="bell-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz bildiriminiz yok</Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;