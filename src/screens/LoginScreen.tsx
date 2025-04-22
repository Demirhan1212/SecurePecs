import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';
import { normalize } from '../utils/normalize';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('BottomTabs');
      setTimeout(() => {
        Alert.alert('SecurePECS 👾', 'Login successful!');
      }, 300);
    } catch (error: any) {
      setTimeout(() => {
        Alert.alert('Login Failed', error.message);
      }, 300);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BackButton />

      <View style={{ paddingTop: normalize(80) }}>
        <Text style={styles.title}>Sign in to Your{'\n'}Account</Text>

        <Image
          source={require('../assets/login_lock.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.inputSection}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.signUpText}>
              New user? <Text style={styles.signUpBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: normalize(24),
  },
  title: {
    fontSize: normalize(26),
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  image: {
    width: '100%',
    height: normalize(140),
    alignSelf: 'center',
    marginBottom: normalize(30),
  },
  inputSection: {
    gap: normalize(14),
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: normalize(10),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    fontSize: normalize(15),
    color: '#fff',
  },
  forgot: {
    color: '#aaa',
    fontSize: normalize(13),
    marginTop: normalize(4),
    marginBottom: normalize(14),
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  signUpText: {
    color: '#ccc',
    fontSize: normalize(13),
    textAlign: 'center',
    marginTop: normalize(16),
  },
  signUpBold: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
