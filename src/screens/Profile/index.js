import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import ProfileService from '../../services/ProfileService';

const Profile = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user', // default role
    volunteerInfo: {
      skills: '',
      availability: '',
      experience: '',
    },
    donorInfo: {
      donationType: '',
      preferredCauses: '',
    },
    recipientInfo: {
      needType: '',
      urgency: 'normal',
      familySize: '',
    }
  });
  
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    loadUserProfile();
  }, [user]);
  
  const loadUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profile = await ProfileService.getUserProfile(user.uid);
      if (profile) {
        setProfileData({
          ...profileData,
          ...profile,
          name: profile.name || user.displayName || '',
          email: profile.email || user.email || '',
        });
      } else {
        // Set default values from Firebase user
        setProfileData({
          ...profileData,
          name: user.displayName || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      Alert.alert('Hata', 'Profil bilgileri yüklenirken bir hata oluştu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await ProfileService.updateUserProfile(user.uid, profileData);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleRoleChange = (role) => {
    setProfileData({
      ...profileData,
      role,
    });
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3c72" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : { uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }
            }
            style={styles.profileImage}
          />
          {editMode && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Fotoğraf Değiştir</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.userName}>{profileData.name}</Text>
        <Text style={styles.userRole}>
          {profileData.role === 'volunteer' && 'Gönüllü'}
          {profileData.role === 'donor' && 'Bağışçı'}
          {profileData.role === 'recipient' && 'Yardım Alan'}
          {profileData.role === 'user' && 'Kullanıcı'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            {!editMode ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditMode(false);
                  loadUserProfile(); // Reset changes
                }}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Ad Soyad</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                placeholder="Ad Soyad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>E-posta</Text>
            <Text style={styles.fieldValue}>{profileData.email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Telefon</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                placeholder="Telefon Numarası"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.phone || 'Belirtilmemiş'}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Adres</Text>
            {editMode ? (
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={profileData.address}
                onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                placeholder="Adres"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profileData.address || 'Belirtilmemiş'}
              </Text>
            )}
          </View>
        </View>

        {editMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rol Seçimi</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  profileData.role === 'user' && styles.activeRoleButton,
                ]}
                onPress={() => handleRoleChange('user')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    profileData.role === 'user' && styles.activeRoleButtonText,
                  ]}
                >
                  Kullanıcı
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  profileData.role === 'volunteer' && styles.activeRoleButton,
                ]}
                onPress={() => handleRoleChange('volunteer')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    profileData.role === 'volunteer' && styles.activeRoleButtonText,
                  ]}
                >
                  Gönüllü
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  profileData.role === 'donor' && styles.activeRoleButton,
                ]}
                onPress={() => handleRoleChange('donor')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    profileData.role === 'donor' && styles.activeRoleButtonText,
                  ]}
                >
                  Bağışçı
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  profileData.role === 'recipient' && styles.activeRoleButton,
                ]}
                onPress={() => handleRoleChange('recipient')}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    profileData.role === 'recipient' && styles.activeRoleButtonText,
                  ]}
                >
                  Yardım Alan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Rol bazlı ek bilgiler */}
        {editMode && profileData.role === 'volunteer' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gönüllü Bilgileri</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Yetenekler</Text>
              <TextInput
                style={styles.input}
                value={profileData.volunteerInfo.skills}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    volunteerInfo: {
                      ...profileData.volunteerInfo,
                      skills: text
                    }
                  })
                }
                placeholder="Yetenekleriniz (örn: ilk yardım, arama kurtarma)"
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Uygunluk Durumu</Text>
              <TextInput
                style={styles.input}
                value={profileData.volunteerInfo.availability}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    volunteerInfo: {
                      ...profileData.volunteerInfo,
                      availability: text
                    }
                  })
                }
                placeholder="Uygunluk durumunuz (örn: hafta içi akşamları)"
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Deneyim</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={profileData.volunteerInfo.experience}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    volunteerInfo: {
                      ...profileData.volunteerInfo,
                      experience: text
                    }
                  })
                }
                placeholder="Önceki deneyimleriniz"
                multiline
              />
            </View>
          </View>
        )}

        {editMode && profileData.role === 'donor' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bağışçı Bilgileri</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Bağış Türü</Text>
              <TextInput
                style={styles.input}
                value={profileData.donorInfo.donationType}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    donorInfo: {
                      ...profileData.donorInfo,
                      donationType: text
                    }
                  })
                }
                placeholder="Bağış türü (örn: maddi, gıda, giyim)"
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tercih Edilen Yardım Alanları</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={profileData.donorInfo.preferredCauses}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    donorInfo: {
                      ...profileData.donorInfo,
                      preferredCauses: text
                    }
                  })
                }
                placeholder="Tercih ettiğiniz yardım alanları"
                multiline
              />
            </View>
          </View>
        )}

        {editMode && profileData.role === 'recipient' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yardım Alan Bilgileri</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>İhtiyaç Türü</Text>
              <TextInput
                style={styles.input}
                value={profileData.recipientInfo.needType}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    recipientInfo: {
                      ...profileData.recipientInfo,
                      needType: text
                    }
                  })
                }
                placeholder="İhtiyaç türü (örn: gıda, barınma, sağlık)"
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Aciliyet Durumu</Text>
              <View style={styles.urgencyContainer}>
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    profileData.recipientInfo.urgency === 'low' && styles.activeUrgencyButton,
                  ]}
                  onPress={() => 
                    setProfileData({
                      ...profileData,
                      recipientInfo: {
                        ...profileData.recipientInfo,
                        urgency: 'low'
                      }
                    })
                  }
                >
                  <Text style={styles.urgencyButtonText}>Düşük</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    profileData.recipientInfo.urgency === 'normal' && styles.activeUrgencyButton,
                  ]}
                  onPress={() => 
                    setProfileData({
                      ...profileData,
                      recipientInfo: {
                        ...profileData.recipientInfo,
                        urgency: 'normal'
                      }
                    })
                  }
                >
                  <Text style={styles.urgencyButtonText}>Normal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.urgencyButton,
                    profileData.recipientInfo.urgency === 'high' && styles.activeUrgencyButton,
                  ]}
                  onPress={() => 
                    setProfileData({
                      ...profileData,
                      recipientInfo: {
                        ...profileData.recipientInfo,
                        urgency: 'high'
                      }
                    })
                  }
                >
                  <Text style={styles.urgencyButtonText}>Yüksek</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Aile Büyüklüğü</Text>
              <TextInput
                style={styles.input}
                value={profileData.recipientInfo.familySize}
                onChangeText={(text) => 
                  setProfileData({
                    ...profileData,
                    recipientInfo: {
                      ...profileData.recipientInfo,
                      familySize: text
                    }
                  })
                }
                placeholder="Aile büyüklüğü"
                keyboardType="number-pad"
              />
            </View>
          </View>
        )}

        {editMode && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;