import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {useAuth} from '../../context/AuthContext';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {register, loading, error} = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    try {
      await register(email, password, {
        displayName: name,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Kayıt Başarılı',
        'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
        [{text: 'Tamam', onPress: () => navigation.navigate('Login')}],
      );
    } catch (err) {
      Alert.alert('Kayıt Hatası', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991231.png',
                }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Acil Yardım</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Hesap Oluştur</Text>

              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TextInput
                style={styles.input}
                placeholder="Şifre Tekrar"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>KAYIT OL</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.toggleButtonText}>
                  Zaten hesabınız var mı? Giriş yapın
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Register;
