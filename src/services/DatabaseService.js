import {database} from '../config/firebase';

class DatabaseService {
  /**
   * Belirtilen referans yoluna veri kaydeder
   * @param {string} path - Veritabanı referans yolu
   * @param {object} data - Kaydedilecek veri
   * @returns {Promise<void>}
   */
  async set(path, data) {
    try {
      await database().ref(path).set(data);
    } catch (error) {
      console.error(`Veri kaydetme başarısız (${path}):`, error.message);
      throw error;
    }
  }

  /**
   * Belirtilen referans yolundaki veriyi günceller
   * @param {string} path - Veritabanı referans yolu
   * @param {object} data - Güncellenecek veri
   * @returns {Promise<void>}
   */
  async update(path, data) {
    try {
      await database().ref(path).update(data);
    } catch (error) {
      console.error(`Veri güncelleme başarısız (${path}):`, error.message);
      throw error;
    }
  }

  /**
   * Belirtilen referans yolundan veri getirir
   * @param {string} path - Veritabanı referans yolu
   * @returns {Promise<object>} Veri nesnesi
   */
  async get(path) {
    try {
      const snapshot = await database().ref(path).once('value');
      return snapshot.val();
    } catch (error) {
      console.error(`Veri getirme başarısız (${path}):`, error.message);
      throw error;
    }
  }

  /**
   * Belirtilen referans yolundaki veriyi siler
   * @param {string} path - Veritabanı referans yolu
   * @returns {Promise<void>}
   */
  async remove(path) {
    try {
      await database().ref(path).remove();
    } catch (error) {
      console.error(`Veri silme başarısız (${path}):`, error.message);
      throw error;
    }
  }

  /**
   * Belirtilen referans yolundaki veri değişikliklerini dinler
   * @param {string} path - Veritabanı referans yolu
   * @param {Function} callback - Veri değiştiğinde çağrılacak fonksiyon
   * @returns {Function} Dinleyiciyi kaldıran fonksiyon
   */
  onValue(path, callback) {
    const reference = database().ref(path);
    reference.on('value', snapshot => callback(snapshot.val()));

    // Dinleyiciyi kaldırmak için fonksiyon döndür
    return () => reference.off('value');
  }

  /**
   * Kullanıcı verilerini kaydet/güncelle
   * @param {string} userId - Kullanıcı ID
   * @param {object} userData - Kullanıcı verileri
   * @returns {Promise<void>}
   */
  async saveUserData(userId, userData) {
    return this.update(`users/${userId}`, {
      ...userData,
      updatedAt: database.ServerValue.TIMESTAMP,
    });
  }

  /**
   * Kullanıcı verilerini getir
   * @param {string} userId - Kullanıcı ID
   * @returns {Promise<object>} Kullanıcı verileri
   */
  async getUserData(userId) {
    return this.get(`users/${userId}`);
  }
}

// Singleton patern ile tek bir instance kullanılmasını sağlar
const databaseService = new DatabaseService();
export default databaseService;
