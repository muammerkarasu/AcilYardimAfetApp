import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

class ProfileService {
  // Kullanıcı profil bilgilerini getir
  async getUserProfile(userId) {
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(userId)
        .get();
      
      if (userDoc.exists) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
  
  // Kullanıcı profil bilgilerini güncelle
  async updateUserProfile(userId, profileData) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set(profileData, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  // Profil fotoğrafı yükle
  async uploadProfilePhoto(userId, uri) {
    try {
      const reference = storage().ref(`profile_photos/${userId}`);
      await reference.putFile(uri);
      
      // Get download URL
      const url = await reference.getDownloadURL();
      
      // Update user profile with photo URL
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          photoURL: url,
        });
      
      return url;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }
  
  // Rol bazlı kullanıcıları getir
  async getUsersByRole(role) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('role', '==', role)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }
}

export default new ProfileService();