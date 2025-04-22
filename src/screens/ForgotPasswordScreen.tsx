import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import BackButton from '../components/BackButton';
import { normalize } from '../utils/normalize';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email has been sent.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <BackButton />

        <View style={{ paddingTop: normalize(80) }}>
          <Text style={styles.topLabel}>Password Reset</Text>

          <Text style={styles.title}>Forgot your password?</Text>

          <Text style={styles.subtitle}>
            Enter your email and we’ll send you instructions to reset your password.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(24),
    backgroundColor: '#0a0a0a',
    flexGrow: 1,
  },
  topLabel: {
    color: '#888',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  title: {
    fontSize: normalize(24),
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#aaa',
    textAlign: 'center',
    marginBottom: normalize(30),
    paddingHorizontal: normalize(10),
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: normalize(10),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    fontSize: normalize(15),
    color: '#fff',
    marginBottom: normalize(20),
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
});
