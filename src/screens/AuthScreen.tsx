import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('CyberSec 🎯', 'Kayıt başarılı!');
      navigation.navigate('LevelSelection');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('CyberSec 👾', 'Giriş başarılı!');
      navigation.navigate('UserTypeSelection');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/unnamed.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>CyberSec 🚀</Text>
        <TextInput
          placeholder="E-posta"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Giriş Yap" onPress={handleLogin} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Kayıt Ol" onPress={handleRegister} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00f6ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
    paddingVertical: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 15,
  },
});

export default AuthScreen;
