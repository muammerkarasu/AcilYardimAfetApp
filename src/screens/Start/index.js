import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {RoutesNames} from '../../config';

const Start = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991231.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Acil Yardım</Text>
          <Text style={styles.tagline}>Afet anında yanınızdayız</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Afet ve acil durumlarda hızlı iletişim, koordinasyon ve yardım için
            güvenilir çözüm
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2518/2518048.png',
              }}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Acil Yardım Çağrısı</Text>
          </View>
          <View style={styles.featureItem}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3588/3588614.png',
              }}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Gönüllü Ol</Text>
          </View>
          <View style={styles.featureItem}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2382/2382461.png',
              }}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Bağış Yap</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>BAŞLA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {}}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              DAHA FAZLA BİLGİ
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Start;
