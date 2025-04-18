import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';

const PersonalAdvancedDashboard = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>👤 Personal - Advanced Level</Text>
      <Text style={styles.content}>🛡️ Module: Network Defense</Text>
      <Text style={styles.content}>📖 Deep Dive: Cyber Hygiene</Text>
    </View>
  );
};

export default PersonalAdvancedDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  title: { fontSize: 22, color: '#00f6ff', marginBottom: 20, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 16, marginVertical: 10 },
});
