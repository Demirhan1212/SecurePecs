import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { normalize } from '../utils/normalize';
import BackButton from '../components/BackButton';

const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { level } = route.params as { level: string };

  const formattedLevel = level.replace('_', ' - ').replace(/^\w/, c => c.toUpperCase());

  const goTo = (type: 'Learn' | 'Quiz' | 'Training') => {
    navigation.navigate(`${type}Screen` as never, { level } as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />

      <View style={{ paddingTop: normalize(80) }}>
        <Text style={styles.topLabel}>Dashboard</Text>

        <Text style={styles.title}>
          Welcome to{'\n'}
          <Text style={styles.bold}>{formattedLevel}</Text>
        </Text>

        <Text style={styles.description}>
          Choose a section to begin your journey.
        </Text>

        <TouchableOpacity style={styles.card} onPress={() => goTo('Learn')}>
          <Image source={require('../assets/learn_icon.png')} style={styles.icon} />
          <Text style={styles.cardText}>Learn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => goTo('Quiz')}>
          <Image source={require('../assets/quiz_icon.png')} style={styles.icon} />
          <Text style={styles.cardText}>Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => goTo('Training')}>
          <Image source={require('../assets/training_icon.png')} style={styles.icon} />
          <Text style={styles.cardText}>Training</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MainDashboardScreen;

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
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(12),
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    width: normalize(36),
    height: normalize(36),
    resizeMode: 'contain',
    marginRight: normalize(16),
  },
  cardText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
  },
});
