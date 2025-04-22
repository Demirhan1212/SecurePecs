import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';
import { normalize } from '../utils/normalize';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      await firestore().collection('users').doc(uid).set({
        firstName,
        lastName,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('SecurePECS 🎯', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BackButton />

      <View style={{ paddingTop: normalize(80) }}>
        <Text style={styles.title}>Create an Account</Text>

        <View style={styles.inputsWrapper}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Already a member? <Text style={styles.linkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By clicking Create Account, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: normalize(24),
  },
  title: {
    fontSize: normalize(26),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: normalize(30),
  },
  inputsWrapper: {
    gap: normalize(14),
    marginBottom: normalize(20),
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: normalize(10),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(15),
    fontSize: normalize(16),
    color: '#fff',
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(20),
  },
  buttonText: {
    color: '#000',
    fontSize: normalize(17),
    fontWeight: '600',
  },
  loginLink: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: normalize(15),
  },
  linkBold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: normalize(13),
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: normalize(16),
    marginTop: normalize(16),
    lineHeight: normalize(18),
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
