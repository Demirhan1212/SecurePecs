import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';

const CorporateAdvancedDashboard = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>🏢 Corporate - Advanced Level</Text>
      <Text style={styles.content}>🔬 Training: Penetration Testing</Text>
      <Text style={styles.content}>📘 Guide: Secure Architecture</Text>
    </View>
  );
};

export default CorporateAdvancedDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { fontSize: 22, color: '#ffcc00', marginBottom: 20, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 16, marginVertical: 10 },
});
