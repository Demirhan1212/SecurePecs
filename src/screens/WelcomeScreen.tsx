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
import { normalize } from '../utils/normalize';

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔺 ÜST: GÖRSEL */}
      <View style={styles.topHalf}>
        <Image
          source={require('../assets/welcome_image.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* BUTTONS */}
      <View style={styles.bottomHalf}>
        <Text style={styles.title}>Welcome to SecurePECS</Text>
        <Text style={styles.subtitle}>
          Discover personalized learning paths to navigate the digital world safely and with confidence.
        </Text>

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: normalize(24),
    paddingTop: normalize(20),
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  subtitle: {
    fontSize: normalize(17),
    color: '#ccc',
    textAlign: 'center',
    marginBottom: normalize(30),
  },
  loginButton: {
    backgroundColor: '#2f89ff',
    borderRadius: normalize(10),
    paddingVertical: normalize(14),
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  loginText: {
    color: '#fff',
    fontSize: normalize(17),
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#222',
    borderRadius: normalize(10),
    paddingVertical: normalize(14),
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  createText: {
    color: '#fff',
    fontSize: normalize(17),
    fontWeight: '500',
  },
  forgotText: {
    color: '#ccc',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: normalize(15),
    marginTop: normalize(6),
  },
});
