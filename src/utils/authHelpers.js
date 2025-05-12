import auth from '@react-native-firebase/auth';

export const handleAuthAction = async (action, email, password) => {
  try {
    if (action === 'login') {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } else if (action === 'register') {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } else {
      throw new Error('Geçersiz işlem türü');
    }
  } catch (error) {
    throw error;
  }
};