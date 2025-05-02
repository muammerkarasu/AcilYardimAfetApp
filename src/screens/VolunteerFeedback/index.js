import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';

const VolunteerFeedback = ({ route, navigation }) => {
  const { volunteerId, requestId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Hata', 'Lütfen bir puan seçin.');
      return;
    }

    try {
      const feedbackData = {
        volunteerId,
        requestId,
        rating,
        comment,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('volunteerFeedbacks').add(feedbackData);

      // Gönüllünün ortalama puanını güncelle
      const volunteerRef = firestore().collection('volunteers').doc(volunteerId);
      const volunteerDoc = await volunteerRef.get();
      const currentData = volunteerDoc.data();

      const newTotalRating = (currentData.totalRating || 0) + rating;
      const newRatingCount = (currentData.ratingCount || 0) + 1;
      const newAverageRating = newTotalRating / newRatingCount;

      await volunteerRef.update({
        totalRating: newTotalRating,
        ratingCount: newRatingCount,
        averageRating: newAverageRating,
      });

      Alert.alert(
        'Başarılı',
        'Geri bildiriminiz için teşekkür ederiz.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Hata', 'Geri bildirim gönderilirken bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gönüllü Değerlendirmesi</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Gönüllünün yardımını nasıl değerlendirirsiniz?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Icon
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#f1c40f' : '#bdc3c7'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.commentTitle}>Yorumunuz (İsteğe Bağlı)</Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Deneyiminizi paylaşın..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitFeedback}
        >
          <Text style={styles.submitButtonText}>Değerlendirmeyi Gönder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VolunteerFeedback;