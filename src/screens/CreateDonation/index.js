import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

const CreateDonation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [donationType, setDonationType] = useState('');
  const [amount, setAmount] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  const handleSubmit = async () => {
    if (!title || !description || !donationType) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Hata', 'Oturum açmanız gerekiyor.');
      return;
    }
    
    setLoading(true);
    try {
      const donation = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'İsimsiz Kullanıcı',
        title,
        description,
        donationType,
        amount: amount ? parseFloat(amount) : null,
        contactInfo,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      await firestore().collection('donations').add(donation);
      
      Alert.alert(
        'Başarılı',
        'Bağış ilanınız başarıyla oluşturuldu.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error creating donation:', error);
      Alert.alert('Hata', 'Bağış ilanı oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
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
        <Text style={styles.headerTitle}>Bağış İlanı Oluştur</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Bağış Bilgileri</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Başlık</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Bağışınız için kısa bir başlık"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Bağışınızı detaylı olarak açıklayın"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Bağış Türü</Text>
          
          <View style={styles.donationTypeContainer}>
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'food' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('food')}
            >
              <Icon
                name="food"
                size={24}
                color={donationType === 'food' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'food' && styles.activeDonationTypeText,
                ]}
              >
                Gıda
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'shelter' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('shelter')}
            >
              <Icon
                name="home"
                size={24}
                color={donationType === 'shelter' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'shelter' && styles.activeDonationTypeText,
                ]}
              >
                Barınma
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'medical' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('medical')}
            >
              <Icon
                name="medical-bag"
                size={24}
                color={donationType === 'medical' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'medical' && styles.activeDonationTypeText,
                ]}
              >
                Tıbbi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'clothing' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('clothing')}
            >
              <Icon
                name="tshirt-crew"
                size={24}
                color={donationType === 'clothing' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'clothing' && styles.activeDonationTypeText,
                ]}
              >
                Giyim
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'money' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('money')}
            >
              <Icon
                name="cash"
                size={24}
                color={donationType === 'money' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'money' && styles.activeDonationTypeText,
                ]}
              >
                Nakit
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.donationTypeButton,
                donationType === 'other' && styles.activeDonationTypeButton,
              ]}
              onPress={() => setDonationType('other')}
            >
              <Icon
                name="gift"
                size={24}
                color={donationType === 'other' ? 'white' : '#1e3c72'}
              />
              <Text
                style={[
                  styles.donationTypeText,
                  donationType === 'other' && styles.activeDonationTypeText,
                ]}
              >
                Diğer
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Miktar {donationType === 'money' ? '(TL)' : '(Adet)'}
            </Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder={donationType === 'money' ? 'Örn: 100' : 'Örn: 5'}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>İletişim Bilgileri (İsteğe Bağlı)</Text>
            <TextInput
              style={styles.input}
              value={contactInfo}
              onChangeText={setContactInfo}
              placeholder="Telefon numarası veya e-posta adresi"
            />
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Bağış İlanı Oluştur</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDonation;