import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FeedbackScreen = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid || !message.trim()) return Alert.alert('Error', 'Please enter feedback');

    try {
      await firestore().collection('feedback').add({
        uid,
        message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setMessage('');
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>We'd love your feedback!</Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Tell us what you think..."
        placeholderTextColor="#aaa"
        style={styles.textArea}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#ffcc00',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: '#1a1a1a',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },
});
