import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles';

const GoogleSignInButton = ({ onPress, isLogin, loading }) => {
  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={onPress}
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
  );
};

export default GoogleSignInButton;