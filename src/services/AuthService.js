import {auth, database} from '../config/firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API URL - replace with your actual backend URL
const API_URL = 'https://your-backend-api.com/api';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Get this from Firebase console
});

class AuthService {
  /**
   * Yeni kullanıcı oluşturur ve Realtime Database'e kaydeder
   * @param {string} email - Kullanıcı e-posta
   * @param {string} password - Kullanıcı şifresi
   * @param {object} userData - Kullanıcı bilgileri
   * @returns {Promise<object>} Kullanıcı nesnesi
   */
  async register(email, password, userData) {
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const {uid} = userCredential.user;

      // Kullanıcı bilgilerini Realtime Database'e kaydet
      await database()
        .ref(`users/${uid}`)
        .set({
          email,
          ...userData,
          createdAt: database.ServerValue.TIMESTAMP,
        });

      return userCredential.user;
    } catch (error) {
      console.error('Kayıt işlemi başarısız:', error.message);
      throw error;
    }
  }

  /**
   * Kullanıcı girişi yapar
   * @param {string} email - Kullanıcı e-posta
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<object>} Kullanıcı nesnesi
   */
  async login(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      console.error('Giriş işlemi başarısız:', error.message);
      throw error;
    }
  }

  /**
   * Kullanıcı çıkışı yapar
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Çıkış işlemi başarısız:', error.message);
      throw error;
    }
  }

  /**
   * Şifre sıfırlama e-postası gönderir
   * @param {string} email - Kullanıcı e-posta
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Şifre sıfırlama başarısız:', error.message);
      throw error;
    }
  }

  /**
   * Mevcut oturum açmış kullanıcıyı döndürür
   * @returns {object|null} Kullanıcı nesnesi veya null
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Kullanıcı oturum durumu değişikliklerini dinler
   * @param {Function} callback - Durum değiştiğinde çağrılacak fonksiyon
   * @returns {Function} Dinleyiciyi kaldıran fonksiyon
   */
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  // Google Sign-In
  async googleLogin() {
    try {
      // Get user ID token
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      // Get JWT token
      const token = await userCredential.user.getIdToken();

      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);

      // Check if user exists in your backend, if not create one
      try {
        await axios.post(`${API_URL}/users`, {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
        });
      } catch (error) {
        // User might already exist, that's fine
        console.log('User might already exist:', error.message);
      }

      return {
        success: true,
        user: userCredential.user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return false;

      // Verify token with your backend
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}

// Singleton patern ile tek bir instance kullanılmasını sağlar
const authService = new AuthService();
export default authService;
