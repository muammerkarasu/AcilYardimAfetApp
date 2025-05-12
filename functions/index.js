const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Yeni yardım talebi oluşturulduğunda yakındaki gönüllülere bildirim gönder
exports.sendHelpRequestNotification = functions.firestore
  .document('helpRequests/{requestId}')
  .onCreate(async (snapshot, context) => {
    try {
      const helpRequest = snapshot.data();
      const requestId = context.params.requestId;
      
      // Yardım talebinin konumu
      const requestLocation = helpRequest.location;
      if (!requestLocation || !requestLocation.latitude || !requestLocation.longitude) {
        console.log('Konum bilgisi eksik, bildirim gönderilemiyor');
        return null;
      }
      
      // Yakındaki gönüllüleri bul (50km yarıçapında)
      // Not: Gerçek bir coğrafi sorgu için Firestore GeoPoint ve geohashing kullanılmalıdır
      // Bu örnek basitleştirilmiştir
      const volunteersSnapshot = await admin.firestore()
        .collection('volunteers')
        .where('status', '==', 'active')
        .get();
      
      const nearbyVolunteers = [];
      
      volunteersSnapshot.forEach(doc => {
        const volunteer = doc.data();
        if (volunteer.location && volunteer.location.latitude && volunteer.location.longitude) {
          // Burada mesafe hesaplaması yapılabilir
          // Basitlik için tüm gönüllüleri dahil ediyoruz
          nearbyVolunteers.push(volunteer);
        }
      });
      
      // Bildirim içeriği
      const notification = {
        title: 'Yakınınızda Yardım Talebi',
        body: `${helpRequest.title || 'Yeni bir yardım talebi'} - ${helpRequest.description?.substring(0, 50) || ''}...`,
        data: {
          type: 'help_request',
          requestId: requestId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
      };
      
      // Her bir gönüllüye bildirim gönder
      const tokens = [];
      nearbyVolunteers.forEach(volunteer => {
        if (volunteer.fcmTokens && volunteer.fcmTokens.length > 0) {
          tokens.push(...volunteer.fcmTokens);
        }
      });
      
      // Tekrarlanan token'ları kaldır
      const uniqueTokens = [...new Set(tokens)];
      
      if (uniqueTokens.length === 0) {
        console.log('Bildirim gönderilecek token bulunamadı');
        return null;
      }
      
      // Toplu bildirim gönder
      const response = await admin.messaging().sendMulticast({
        tokens: uniqueTokens,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data,
        android: {
          notification: {
            channelId: 'help-requests',
            icon: 'ic_notification',
            color: '#1e3c72',
            priority: 'high',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });
      
      console.log(`${response.successCount} bildirim başarıyla gönderildi`);
      
      // Bildirim kayıtlarını veritabanına ekle
      const batch = admin.firestore().batch();
      
      nearbyVolunteers.forEach(volunteer => {
        if (volunteer.userId) {
          const notificationRef = admin.firestore().collection('notifications').doc();
          batch.set(notificationRef, {
            userId: volunteer.userId,
            title: notification.title,
            body: notification.body,
            type: 'help_request',
            data: {
              requestId: requestId,
            },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      });
      
      await batch.commit();
      
      return null;
    } catch (error) {
      console.error('Bildirim gönderilirken hata:', error);
      return null;
    }
  });

// Yardım talebi durumu güncellendiğinde bildirim gönder
exports.sendHelpRequestUpdateNotification = functions.firestore
  .document('helpRequests/{requestId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      const requestId = context.params.requestId;
      
      // Durum değişmediyse bildirim gönderme
      if (before.status === after.status) {
        return null;
      }
      
      // Talep sahibine bildirim gönder
      const userId = after.userId;
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı, bildirim gönderilemiyor');
        return null;
      }
      
      // Kullanıcı bilgilerini al
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.log('Kullanıcı bulunamadı');
        return null;
      }
      
      const user = userDoc.data();
      const fcmTokens = user.fcmTokens || [];
      
      if (fcmTokens.length === 0) {
        console.log('Kullanıcının FCM token\'ı yok');
        return null;
      }
      
      // Bildirim içeriği
      let title = 'Yardım Talebiniz Güncellendi';
      let body = '';
      
      switch (after.status) {
        case 'assigned':
          title = 'Yardım Talebiniz Kabul Edildi';
          body = 'Bir gönüllü yardım talebinizi kabul etti ve yakında size ulaşacak.';
          break;
        case 'in_progress':
          title = 'Yardım Talebiniz İşleniyor';
          body = 'Gönüllü şu anda yardım talebiniz üzerinde çalışıyor.';
          break;
        case 'completed':
          title = 'Yardım Talebiniz Tamamlandı';
          body = 'Yardım talebiniz başarıyla tamamlandı. Lütfen gönüllüyü değerlendirin.';
          break;
        case 'cancelled':
          title = 'Yardım Talebiniz İptal Edildi';
          body = 'Yardım talebiniz iptal edildi.';
          break;
      }