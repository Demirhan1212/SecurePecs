import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import BackButton from '../components/BackButton';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Şifre Sıfırlama', 'E-posta gönderildi!');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <BackButton />
      </View>

      <Text style={styles.title}>Şifre Sıfırlama</Text>
      <TextInput
        placeholder="E-posta"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Sıfırlama Bağlantısı Gönder" onPress={handleResetPassword} />
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
    marginBottom: 20,
    paddingVertical: 8,
  },
});
