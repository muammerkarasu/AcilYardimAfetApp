import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DonationDetail = ({ route, navigation }) => {
  const { donationId } = route.params;
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadDonation();
  }, []);

  const loadDonation = async () => {
    try {
      const currentUser = auth().currentUser;
      
      const doc = await firestore()
        .collection('donations')
        .doc(donationId)
        .get();
      
      if (!doc.exists) {
        Alert.alert('Hata', 'Bağış ilanı bulunamadı.');
        navigation.goBack();
        return;
      }
      
      const data = { id: doc.id, ...doc.data() };
      setDonation(data);
      
      if (currentUser && data.userId === currentUser.uid) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error('Error loading donation:', error);
      Alert.alert('Hata', 'Bağış ilanı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Onay',
      'Bu bağış ilanını silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet', 
          onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection('donations').doc(donationId).delete();
              Alert.alert('Başarılı', 'Bağış ilanı silindi.');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting donation:', error);
              Alert.alert('Hata', 'Bağış ilanı silinirken bir hata oluştu.');
              setLoading(false);
            }
          } 
        },
      ]
    );
  };

  const handleContact = () => {
    if (donation.contactInfo) {
      if (donation.contactInfo.includes('@')) {
        Linking.openURL(`mailto:${donation.contactInfo}`);
      } else {
        Linking.openURL(`tel:${donation.contactInfo}`);
      }
    } else {
      Alert.alert('Bilgi', 'Bu bağış için iletişim bilgisi bulunmuyor.');
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

  if (loading) {
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
          <Text style={styles.headerTitle}>Bağış Detayı</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3c72" />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Bağış Detayı</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.detailContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{donation.title}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="account" size={20} color="#1e3c72" />
              <Text style={styles.infoText}>{donation.userName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={20} color="#1e3c72" />
              <Text style={styles.infoText}>
                {donation.createdAt?.toDate ? 
                  new Date(donation.createdAt.toDate()).toLocaleDateString('tr-TR') : 
                  'Tarih belirtilmemiş'}
              </Text>
            </View>
          </View>

          <View style={styles.typeContainer}>
            <View style={styles.typeItem}>
              <Icon
                name={
                  donation.donationType === 'food'
                    ? 'food'
                    : donation.donationType === 'shelter'
                    ? 'home'
                    : donation.donationType === 'medical'
                    ? 'medical-bag'
                    : donation.donationType === 'clothing'
                    ? 'tshirt-crew'
                    : donation.donationType === 'money'
                    ? 'cash'
                    : 'gift'
                }
                size={24}
                color="#1e3c72"
              />
              <Text style={styles.typeText}>
                {getDonationTypeText(donation.donationType)}
              </Text>
            </View>
            
            {donation.amount && (
              <View style={styles.typeItem}>
                <Icon name="tag" size={24} color="#ff5722" />
                <Text style={[styles.typeText, { color: '#ff5722' }]}>
                  {donation.donationType === 'money' ? 
                    `${donation.amount} TL` : 
                    `${donation.amount} adet`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{donation.description}</Text>
          </View>

          {donation.contactInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
              <View style={styles.contactContainer}>
                <Icon 
                  name={donation.contactInfo.includes('@') ? 'email' : 'phone'} 
                  size={20} 
                  color="#1e3c72" 
                />
                <Text style={styles.contactText}>{donation.contactInfo}</Text>
              </View>
            </View>
          )}

          <View style={styles.actionContainer}>
            {isOwner ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Icon name="delete" size={20} color="white" />
                <Text style={styles.actionButtonText}>İlanı Sil</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={handleContact}
              >
                <Icon name="message" size={20} color="white" />
                <Text style={styles.actionButtonText}>İletişime Geç</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonationDetail;