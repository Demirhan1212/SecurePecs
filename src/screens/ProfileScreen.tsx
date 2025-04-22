import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../utils/normalize';

const avatarKeys = [
  'ppicture1',
  'ppicture2',
  'ppicture3',
  'ppicture4',
  'ppicture5',
  'ppicture6',
  'ppicture7',
  'ppicture8',
  'ppicture9',
  'ppicture10',
];

const getAvatarImage = (key: string) => {
  switch (key) {
    case 'ppicture1': return require('../assets/ppicture1.png');
    case 'ppicture2': return require('../assets/ppicture2.png');
    case 'ppicture3': return require('../assets/ppicture3.png');
    case 'ppicture4': return require('../assets/ppicture4.png');
    case 'ppicture5': return require('../assets/ppicture5.png');
    case 'ppicture6': return require('../assets/ppicture6.png');
    case 'ppicture7': return require('../assets/ppicture7.png');
    case 'ppicture8': return require('../assets/ppicture8.png');
    case 'ppicture9': return require('../assets/ppicture9.png');
    case 'ppicture10': return require('../assets/ppicture10.png');
    default: return require('../assets/profile_icon.png');
  }
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) return;

      const userDoc = await firestore().collection('users').doc(uid).get();
      const userData = userDoc.data();

      if (userData) {
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setEmail(userData.email || '');
        setAvatar(userData.avatar || '');
      }

      setLoading(false);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load profile: ' + error.message);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) return;

      await firestore().collection('users').doc(uid).update({
        firstName,
        lastName,
        avatar,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.topLabel}>Profile</Text>

      <Text style={styles.title}>Welcome back{'\n'}<Text style={styles.bold}>{firstName}</Text></Text>

      <Text style={styles.description}>Update your information and choose your avatar</Text>

      <Image source={getAvatarImage(avatar)} style={styles.avatarImage} />

      <Text style={styles.sectionLabel}>Choose Avatar</Text>
      <FlatList
        data={avatarKeys}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setAvatar(item)}>
            <Image
              source={getAvatarImage(item)}
              style={[
                styles.avatarOption,
                avatar === item && styles.avatarOptionSelected,
              ]}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.form}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          editable={false}
          placeholderTextColor="#aaa"
          style={[styles.input, { backgroundColor: '#2a2a2a' }]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    padding: normalize(24),
    paddingBottom: normalize(100), // Tab bar ile boşluk
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: normalize(16),
  },
  topLabel: {
    color: '#888',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '400',
    color: '#fff',
    textAlign: 'left',
    marginBottom: normalize(10),
  },
  bold: {
    fontWeight: '700',
  },
  description: {
    color: '#aaa',
    fontSize: normalize(14),
    marginBottom: normalize(20),
  },
  avatarImage: {
    width: normalize(140),
    height: normalize(140),
    borderRadius: normalize(70),
    alignSelf: 'center',
    marginBottom: normalize(20),
    borderWidth: 3,
    borderColor: '#ffcc00',
  },
  sectionLabel: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: normalize(10),
  },
  avatarList: {
    paddingVertical: normalize(6),
    justifyContent: 'center',
    paddingHorizontal: normalize(4),
  },
  avatarOption: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(32),
    marginRight: normalize(12),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#ffcc00',
  },
  form: {
    marginTop: normalize(20),
    gap: normalize(14),
  },
  input: {
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(10),
    color: '#fff',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(12),
    fontSize: normalize(15),
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginTop: normalize(30),
  },
  buttonText: {
    color: '#000',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginTop: normalize(16),
    marginBottom: normalize(30), // ekstra alt boşluk
  },
  logoutText: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: '600',
  },
});

