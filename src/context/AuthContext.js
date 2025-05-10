import React, {createContext, useState, useEffect, useContext} from 'react';
import authService from '../services/AuthService';
import databaseService from '../services/DatabaseService';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcı oturum durumunu izle
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async firebaseUser => {
      try {
        if (firebaseUser) {
          // Realtime Database'den kullanıcı bilgilerini al
          const userData = await databaseService.getUserData(firebaseUser.uid);

          setUser({
            ...firebaseUser,
            ...userData,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Clean-up: component unmount olduğunda dinleyiciyi kaldır
    return unsubscribe;
  }, []);

  // Kayıt işlemi
  const register = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register(email, password, userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Giriş işlemi
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      await authService.login(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama
  const resetPassword = async email => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı bilgilerini güncelleme
  const updateUserData = async userData => {
    if (!user) return;

    try {
      setLoading(true);
      await databaseService.saveUserData(user.uid, userData);

      // Kullanıcı state'ini güncelle
      setUser(prevUser => ({
        ...prevUser,
        ...userData,
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        resetPassword,
        updateUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook ile context'e kolay erişim
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
