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

const Donations = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all'); // all, mine, food, medical, clothing, shelter, other

  useEffect(() => {
    loadDonations();
  }, [filter]);

  const loadDonations = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let query = firestore().collection('donations');
      
      if (filter === 'mine') {
        query = query.where('userId', '==', currentUser.uid);
      } else if (filter !== 'all') {
        query = query.where('donationType', '==', filter);
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      
      const donationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setDonations(donationList);
    } catch (error) {
      console.error('Error loading donations:', error);
      Alert.alert('Hata', 'Bağışlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDonations();
  };

  const handleCreateDonation = () => {
    navigation.navigate('CreateDonation');
  };

  const handleDonationPress = (donation) => {
    navigation.navigate('DonationDetail', { donationId: donation.id });
  };

  const getDonationTypeIcon = (type) => {
    switch (type) {
      case 'food':
        return 'food';
      case 'shelter':
        return 'home';
      case 'medical':
        return 'medical-bag';
      case 'clothing':
        return 'tshirt-crew';
      case 'money':
        return 'cash';
      default:
        return 'gift';
    }
  };

  const getDonationTypeText = (type) => {
    switch (type) {
      case 'food':
        return 'Gıda';
      case 'shelter':
        return 'Barınma';
      case 'medical':
        return 'Tıbbi Malzeme';
      case 'clothing':
        return 'Giyim';
      case 'money':
        return 'Nakit';
      default:
        return 'Diğer';
    }
  };

  const renderDonation = ({ item }) => (
    <TouchableOpacity
      style={styles.donationCard}
      onPress={() => handleDonationPress(item)}
    >
      <View style={styles.donationHeader}>
        <View style={styles.donationTypeContainer}>
          <Icon
            name={getDonationTypeIcon(item.donationType)}
            size={24}
            color="#1e3c72"
          />
          <Text style={styles.donationType}>
            {getDonationTypeText(item.donationType)}
          </Text>
        </View>
        {item.amount && (
          <Text style={styles.donationAmount}>
            {item.donationType === 'money' ? `${item.amount} TL` : `${item.amount} adet`}
          </Text>
        )}
      </View>
      
      <Text style={styles.donationTitle}>{item.title}</Text>
      <Text style={styles.donationDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.donationFooter}>
        <View style={styles.userContainer}>
          <Icon name="account" size={16} color="#666" />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={styles.timeText}>
          {item.createdAt?.toDate ? 
            new Date(item.createdAt.toDate()).toLocaleDateString('tr-TR') : 
            'Tarih belirtilmemiş'}
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
        <Text style={styles.headerTitle}>Bağışlar</Text>
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
              Benim Bağışlarım
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'food' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('food')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'food' && styles.activeFilterButtonText,
              ]}
            >
              Gıda
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'medical' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('medical')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'medical' && styles.activeFilterButtonText,
              ]}
            >
              Tıbbi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'clothing' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('clothing')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'clothing' && styles.activeFilterButtonText,
              ]}
            >
              Giyim
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'money' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter('money')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'money' && styles.activeFilterButtonText,
              ]}
            >
              Nakit
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
          data={donations}
          renderItem={renderDonation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="gift-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Bağış bulunamadı</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateDonation}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Donations;