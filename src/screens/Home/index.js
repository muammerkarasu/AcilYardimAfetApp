import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const Home = ({ navigation }) => {
  const emergencyServices = [
    {
      id: '1',
      title: 'Acil Yardım Çağrısı',
      icon: 'https://cdn-icons-png.flaticon.com/512/2518/2518048.png',
      color: '#e74c3c',
    },
    {
      id: '2',
      title: 'Deprem Bildirimi',
      icon: 'https://cdn-icons-png.flaticon.com/512/2200/2200326.png',
      color: '#e67e22',
    },
    {
      id: '3',
      title: 'Sel Bildirimi',
      icon: 'https://cdn-icons-png.flaticon.com/512/4005/4005837.png',
      color: '#3498db',
    },
    {
      id: '4',
      title: 'Yangın Bildirimi',
      icon: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      color: '#d35400',
    },
  ];

  const supportServices = [
    {
      id: '1',
      title: 'Gönüllü Ol',
      icon: 'https://cdn-icons-png.flaticon.com/512/3588/3588614.png',
      description: 'Afet bölgelerinde yardım çalışmalarına katılın',
    },
    {
      id: '2',
      title: 'Bağış Yap',
      icon: 'https://cdn-icons-png.flaticon.com/512/2382/2382461.png',
      description: 'Afetzedelere maddi destek sağlayın',
    },
    {
      id: '3',
      title: 'Güvenli Bölgeler',
      icon: 'https://cdn-icons-png.flaticon.com/512/684/684809.png',
      description: 'Size en yakın güvenli toplanma alanlarını görüntüleyin',
    },
  ];

  const handleEmergencyPress = (service) => {
    // Handle emergency service press
    console.log(`${service.title} pressed`);
  };

  const handleSupportPress = (service) => {
    // Handle support service press
    console.log(`${service.title} pressed`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3c72" />
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Merhaba, Kullanıcı</Text>
          <Text style={styles.headerText}>Acil durumda yardım için buradayız</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.emergencyContainer}>
          <Text style={styles.sectionTitle}>Acil Durum Hizmetleri</Text>
          <View style={styles.emergencyButtonsContainer}>
            {emergencyServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.emergencyButton, { backgroundColor: service.color }]}
                onPress={() => handleEmergencyPress(service)}
              >
                <Image
                  source={{ uri: service.icon }}
                  style={styles.emergencyIcon}
                />
                <Text style={styles.emergencyButtonText}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>Son Uyarılar</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertCard}>
            <View style={styles.alertIconContainer}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1682/1682643.png' }}
                style={styles.alertIcon}
              />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertCardTitle}>Meteoroloji Uyarısı</Text>
              <Text style={styles.alertCardDescription}>
                Marmara bölgesinde kuvvetli yağış bekleniyor. Lütfen önlem alın.
              </Text>
              <Text style={styles.alertTime}>2 saat önce</Text>
            </View>
          </View>
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.sectionTitle}>Destek Hizmetleri</Text>
          {supportServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.supportCard}
              onPress={() => handleSupportPress(service)}
            >
              <Image
                source={{ uri: service.icon }}
                style={styles.supportIcon}
              />
              <View style={styles.supportContent}>
                <Text style={styles.supportTitle}>{service.title}</Text>
                <Text style={styles.supportDescription}>{service.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Bilgilendirme</Text>
          <TouchableOpacity style={styles.infoCard}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2641/2641409.png' }}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Afet Bilgilendirme Rehberi</Text>
              <Text style={styles.infoDescription}>
                Afet öncesi, sırası ve sonrasında yapılması gerekenler
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;