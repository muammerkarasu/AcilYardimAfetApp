import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isLogin,
  loading,
  handleSubmit,
  navigation,
}) => {
  return (
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
    </View>
  );
};

export default LoginForm;