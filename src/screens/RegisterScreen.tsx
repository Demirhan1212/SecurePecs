import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // 🔐 Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      // 📝 Firestore'a kullanıcı bilgisi ekleme
      await firestore().collection('users').doc(uid).set({
        firstName,
        lastName,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('CyberSec 🎯', 'Kayıt başarılı!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Kayıt Hatası', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BackButton />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Enter your email to sign up for this app</Text>

        <View style={styles.inputsWrapper}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By clicking continue, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#222',
  },
  formContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputsWrapper: {
    marginTop: 10,
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
