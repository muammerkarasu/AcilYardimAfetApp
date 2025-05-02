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
import {RoutesNames} from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {useAuth} from '../../context/AuthContext';

const Login = ({navigation}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const {login, register, loading, error} = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        navigation.navigate(RoutesNames.TAB_SCREEN);
      } else {
        if (!name) {
          Alert.alert('Hata', 'Lütfen adınızı girin.');
          return;
        }

        await register(email, password, {displayName: name});
        Alert.alert(
          'Kayıt Başarılı',
          'Hesabınız oluşturuldu, şimdi giriş yapabilirsiniz.',
          [{text: 'Tamam', onPress: () => setIsLogin(true)}],
        );
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Bilgi',
      'Google ile giriş özelliği şu anda geliştirme aşamasındadır.',
    );
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
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
              <Text style={styles.headerText}>
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
              </Text>

              {!isLogin && (
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={name}
                  onChangeText={setName}
                />
              )}

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

              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'GİRİŞ YAP' : 'KAYIT OL'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
                  }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>
                  Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleMode}>
                <Text style={styles.toggleButtonText}>
                  {isLogin
                    ? 'Hesabınız yok mu? Kayıt olun'
                    : 'Zaten hesabınız var mı? Giriş yapın'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Login;
