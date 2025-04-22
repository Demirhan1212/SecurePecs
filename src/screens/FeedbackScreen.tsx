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
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { normalize } from '../utils/normalize';

const FeedbackScreen = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid || !message.trim()) {
      return Alert.alert('Oops!', 'Please write something before submitting.');
    }

    try {
      await firestore().collection('feedback').add({
        uid,
        message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Thank you! 🎉', 'Your feedback has been sent successfully.');
      setMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Feedback</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Share your thoughts{'\n'}<Text style={styles.bold}>with us!</Text>
        </Text>

        <Text style={styles.description}>
          Let us know how we can improve your experience.
        </Text>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write your feedback here..."
          placeholderTextColor="#888"
          style={styles.textArea}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? normalize(60) : normalize(30),
    paddingBottom: normalize(10),
    alignItems: 'center',
  },
  headerText: {
    color: '#888',
    fontSize: normalize(14),
    fontWeight: '500',
  },
  container: {
    padding: normalize(24),
    flexGrow: 1,
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '400',
    color: '#fff',
    textAlign: 'left',
    marginBottom: normalize(10),
  },
  bold: {
    fontWeight: '700',
  },
  description: {
    color: '#aaa',
    fontSize: normalize(14),
    marginBottom: normalize(20),
  },
  textArea: {
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(10),
    padding: normalize(14),
    fontSize: normalize(15),
    color: '#fff',
    minHeight: normalize(120),
    marginBottom: normalize(20),
  },
  button: {
    backgroundColor: '#ffcc00', // 💛 Sarı buton
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: normalize(16),
  },
});
