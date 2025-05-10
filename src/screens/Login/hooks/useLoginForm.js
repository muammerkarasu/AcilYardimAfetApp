import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { RoutesNames } from '../../../config';

export const useLoginForm = (navigation) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { login, register, loading } = useAuth();

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

        await register(email, password, { displayName: name });
        Alert.alert(
          'Kayıt Başarılı',
          'Hesabınız oluşturuldu, şimdi giriş yapabilirsiniz.',
          [{ text: 'Tamam', onPress: () => setIsLogin(true) }],
        );
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return {
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    handleSubmit,
  };
};