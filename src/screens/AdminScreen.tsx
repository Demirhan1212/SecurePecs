
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AdminScreen = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('feedback')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbackList(data);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📩 Feedback Submissions</Text>
      <FlatList
        data={feedbackList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feedbackItem}>
            <Text style={styles.email}>From: {item.uid}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 16 },
  title: { fontSize: 20, color: '#ffcc00', marginBottom: 12, fontWeight: '600' },
  feedbackItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  email: { color: '#ccc', fontSize: 12, marginBottom: 4 },
  message: { color: '#fff', fontSize: 14 },
});
