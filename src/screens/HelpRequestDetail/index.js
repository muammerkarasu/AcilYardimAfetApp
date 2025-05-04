import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MapView, { Marker } from 'react-native-maps';

const HelpRequestDetail = ({ route, navigation }) => {
  const { requestId } = route.params;
  const [loading, setLoading] = useState(true);
  const [helpRequest, setHelpRequest] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    loadHelpRequest();
  }, []);

  const loadHelpRequest = async () => {
    try {
      const currentUser = auth().currentUser;
      
      const doc = await firestore()
        .collection('helpRequests')
        .doc(requestId)
        .get();
      
      if (!doc.exists) {
        Alert.alert('Hata', 'Yardım çağrısı bulunamadı.');
        navigation.goBack();
        return;
      }
      
      const data = { id: doc.id, ...doc.data() };
      setHelpRequest(data);
      
      if (currentUser && data.userId === currentUser.uid) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error('Error loading help request:', error);
      Alert.alert('Hata', 'Yardım çağrısı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      
      await firestore()
        .collection('helpRequests')
        .doc(requestId)
        .update({
          status: newStatus,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      
      setHelpRequest(prev => ({ ...prev, status: newStatus }));
      
      Alert.alert('Başarılı', 'Yardım çağrısı durumu güncellendi.');
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Hata', 'Durum güncellenirken bir hata oluştu.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAccept = () => {
    Alert.alert(
      'Onay',
      'Bu yardım çağrısını kabul etmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => handleStatusChange('accepted') },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Onay',
      'Bu yardım çağrısını tamamlandı olarak işaretlemek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => handleStatusChange('completed') },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Onay',
      'Bu yardım çağrısını iptal etmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => handleStatusChange('cancelled') },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'accepted':
        return '#3498db';
      case 'completed':
        return '#2ecc71';
      case 'cancelled':
        return '#e74c3c';
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
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getRequestTypeText = (requestType) => {
    switch (requestType) {
      case 'food':
        return 'Gıda';
      case 'shelter':
        return 'Barınma';
      case 'medical':
        return 'Tıbbi Destek';
      case 'clothing':
        return 'Giyim';
      default:
        return 'Diğer';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'Düşük';
      case 'normal':
        return 'Normal';
      case 'high':
        return 'Yüksek';
      default:
        return 'Normal';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return '#2ecc71';
      case 'normal':
        return '#f39c12';
      case 'high':
        return '#e74c3c';
      default:
        return '#f39c12';
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
          <Text style={styles.headerTitle}>Yardım Çağrısı</Text>
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
        <Text style={styles.headerTitle}>Yardım Çağrısı</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.detailContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{helpRequest.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(helpRequest.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(helpRequest.status)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="account" size={20} color="#1e3c72" />
              <Text style={styles.infoText}>{helpRequest.userName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={20} color="#1e3c72" />
              <Text style={styles.infoText}>
                {helpRequest.createdAt?.toDate ? 
                  new Date(helpRequest.createdAt.toDate()).toLocaleDateString('tr-TR') : 
                  'Tarih belirtilmemiş'}
              </Text>
            </View>
          </View>

          <View style={styles.typeContainer}>
            <View style={styles.typeItem}>
              <Icon
                name={
                  helpRequest.requestType === 'food'
                    ? 'food'
                    : helpRequest.requestType === 'shelter'
                    ? 'home'
                    : helpRequest.requestType === 'medical'
                    ? 'medical-bag'
                    : helpRequest.requestType === 'clothing'
                    ? 'tshirt-crew'
                    : 'help-circle'
                }
                size={24}
                color="#1e3c72"
              />
              <Text style={styles.typeText}>
                {getRequestTypeText(helpRequest.requestType)}
              </Text>
            </View>
            
            <View style={styles.typeItem}>
              <Icon name="alert-circle" size={24} color={getUrgencyColor(helpRequest.urgency)} />
              <Text
                style={[
                  styles.typeText,
                  { color: getUrgencyColor(helpRequest.urgency) },
                ]}
              >
                {getUrgencyText(helpRequest.urgency)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{helpRequest.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konum</Text>
            {helpRequest.location && helpRequest.location.latitude && helpRequest.location.longitude ? (
              <>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: helpRequest.location.latitude,
                      longitude: helpRequest.location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: helpRequest.location.latitude,
                        longitude: helpRequest.location.longitude,
                      }}
                    />
                  </MapView>
                </View>
                
                <View style={styles.addressContainer}>
                  <Icon name="map-marker" size={20} color="#1e3c72" />
                  <Text style={styles.addressText}>
                    {helpRequest.location.address || 'Adres belirtilmemiş'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.noLocationText}>Konum bilgisi bulunmuyor</Text>
            )}
          </View>

          {helpRequest.status !== 'completed' && helpRequest.status !== 'cancelled' && (
            <View style={styles.actionContainer}>
              {isOwner ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Icon name="close-circle" size={20} color="white" />
                      <Text style={styles.actionButtonText}>İptal Et</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  {helpRequest.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={handleAccept}
                      disabled={statusLoading}
                    >
                      {statusLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <>
                          <Icon name="check-circle" size={20} color="white" />
                          <Text style={styles.actionButtonText}>Kabul Et</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                  
                  {helpRequest.status === 'accepted' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={handleComplete}
                      disabled={statusLoading}
                    >
                      {statusLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <>
                          <Icon name="check-all" size={20} color="white" />
                          <Text style={styles.actionButtonText}>Tamamlandı</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpRequestDetail;
