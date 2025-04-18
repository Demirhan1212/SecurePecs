import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('BottomTabs');

      // Alert after navigation to prevent activity errors
      setTimeout(() => {
        Alert.alert('CyberSec 👾', 'Login successful!');
      }, 300);
    } catch (error: any) {
      setTimeout(() => {
        Alert.alert('Login Failed', error.message);
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="example@mail.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 28,
    color: '#00f6ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#00f6ff',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00f6ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
