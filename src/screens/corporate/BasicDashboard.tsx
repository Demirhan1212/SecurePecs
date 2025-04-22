import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import BackButton from '../../components/BackButton';
import { normalize } from '../../utils/normalize';

const CorporateBasicDashboard = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />

      <Text style={styles.topLabel}>Dashboard</Text>

      <Text style={styles.title}>
        Welcome to{'\n'}<Text style={styles.bold}>Corporate - Basic</Text>
      </Text>

      <Text style={styles.description}>
        Start with these core modules to boost your security awareness.
      </Text>

      <TouchableOpacity style={styles.card}>
        <Image source={require('../../assets/learn_icon.png')} style={styles.icon} />
        <Text style={styles.cardText}>Learn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={require('../../assets/quiz_icon.png')} style={styles.icon} />
        <Text style={styles.cardText}>Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={require('../../assets/training_icon.png')} style={styles.icon} />
        <Text style={styles.cardText}>Training</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CorporateBasicDashboard;

const styles = StyleSheet.create({
  container: {
    padding: normalize(24),
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
    marginBottom: normalize(24),
  },
  card: {
    backgroundColor: '#1c1c1e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(18),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(12),
    marginBottom: normalize(20),
  },
  icon: {
    width: normalize(32),
    height: normalize(32),
    resizeMode: 'contain',
    marginRight: normalize(16),
  },
  cardText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
  },
});
