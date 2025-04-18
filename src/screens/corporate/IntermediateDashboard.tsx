import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';

const CorporateIntermediateDashboard = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>🏢 Corporate - Intermediate Level</Text>
      <Text style={styles.content}>🛠️ Module: Risk Management</Text>
      <Text style={styles.content}>📊 Quiz: Incident Response</Text>
    </View>
  );
};

export default CorporateIntermediateDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { fontSize: 22, color: '#ffcc00', marginBottom: 20, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 16, marginVertical: 10 },
});
