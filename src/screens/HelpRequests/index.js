import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HelpRequests = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [helpRequests, setHelpRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // all, mine, pending, accepted, completed

  useEffect(() => {
    loadHelpRequests();
  }, [filter]);

  const loadHelpRequests = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let query = firestore().collection('helpRequests');
      
      switch (filter) {
        case 'mine':
          query = query.where('userId', '==', currentUser.uid);
          break;
        case 'pending':
          query = query.where('status', '==', 'pending');
          break;
        case 'accepted':
          query = query.where('status', '==', 'accepted');
          break;
        case 'completed':
          query = query.where('status', '==', 'completed');
          break;
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setHelpRequests(requests);
    } catch (error) {
      console.error('Error loading help requests:', error);
      Alert.alert('Hata', 'Yardım çağrıları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHelpRequests();
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateHelpRequest');
  };

  const handleRequestPress = (request) => {
    navigation.navigate('HelpRequestDetail', { requestId: request.id });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'accepted':
        return '#3498db';
      case 'completed':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'accepted':
        return 'Kabul Edildi';
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Bilinmiyor';
    }
  };

  const renderHelpRequest = ({ item }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestTypeContainer}>
          <Icon
            name={
              item.requestType === 'food'
                ? 'food'
                : item.requestType === 'shelter'
                ? 'home'
                : item.requestType === 'medical'
                ? 'medical-bag'
                : item.requestType === 'clothing'
                ? 'tshirt-crew'
                : 'help-circle'
            }
            size={24}
            color="#1e3c72"
          />
          <Text style={styles.requestType}>
            {item.requestType === 'food'
              ? 'Gıda'
              : item.requestType === 'shelter'
              ? 'Barınma'
              : item.requestType === 'medical'
              ? 'Tıbbi Destek'
              : item.requestType === 'clothing'
              ? 'Giyim'
              : 'Diğer'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.requestTitle}>{item.title}</Text>
      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.requestFooter}>
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location?.address || 'Konum belirtilmemiş'}</Text>
        </View>
        <Text style={styles.timeText}>
          {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Yardım Çağrıları</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.activeFilterButtonText,
              ]}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'mine' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('mine')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'mine' && styles.activeFilterButtonText,
              ]}
            >
              Benim Çağrılarım
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'pending' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('pending')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'pending' && styles.activeFilterButtonText,
              ]}
            >
              Beklemede
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'accepted' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('accepted')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'accepted' && styles.activeFilterButtonText,
              ]}
            >
              Kabul Edildi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'completed' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'completed' && styles.activeFilterButtonText,
              ]}
            >
              Tamamlandı
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3c72" />
        </View>
      ) : (
        <FlatList
          data={helpRequests}
          renderItem={renderHelpRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="alert-circle-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Yardım çağrısı bulunamadı</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateRequest}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HelpRequests;