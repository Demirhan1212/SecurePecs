import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
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
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login'); // replace ile geri dönüşü engelliyoruz
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
      <Text style={styles.title}>My Profile</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <TextInput
        placeholder="Email"
        value={email}
        editable={false}
        style={[styles.input, { backgroundColor: '#333' }]}
        placeholderTextColor="#aaa"
      />

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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    color: '#ffcc00',
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
