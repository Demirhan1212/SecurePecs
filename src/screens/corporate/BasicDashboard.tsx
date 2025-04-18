import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';

const CorporateBasicDashboard = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>🏢 Corporate - Basic Level</Text>
      <Text style={styles.content}>📋 Training: Safe Workplace Habits</Text>
      <Text style={styles.content}>🔐 Game: Access Control</Text>
    </View>
  );
};

export default CorporateBasicDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { fontSize: 22, color: '#ffcc00', marginBottom: 20, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 16, marginVertical: 10 },
});
