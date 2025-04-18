import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔺 Üst Yarı: Görsel Alan */}
      <View style={styles.topHalf}>
        <Image
          source={require('../assets/welcome_image.png')} // 👈 kendi görselini buraya koy
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* 🔻 Alt Yarı: Butonlar */}
      <View style={styles.bottomHalf}>
        <Text style={styles.title}>Welcome to CyberSec</Text>
        <Text style={styles.subtitle}>Your security journey starts here 🚀</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#444' }]}
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '80%',
    height: '90%',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#00f6ff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00f6ff',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 18,
    textDecorationLine: 'underline',
  },
});
