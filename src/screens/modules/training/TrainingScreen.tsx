import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';

const TrainingScreen = () => {
  const navigation = useNavigation();
  const { level } = useRoute().params as { level: string };

  const items = [
    {
      name: 'Phishing Simulator',
      key: 'PhishingSimulator',
    },
    {
      name: 'Password Puzzle',
      key: 'PasswordPuzzle',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎮 Interactive Trainings</Text>
        <Text style={styles.description}>
          Choose a game below to test your awareness.
        </Text>

        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() =>
              navigation.navigate('PhishingSimulatorScreen' as never, {
                moduleName: item.key,
                level,
              } as never)
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>Play Now →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrainingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + normalize(10) : normalize(10),
    left: normalize(16),
    zIndex: 10,
  },
  container: {
    paddingTop: normalize(80),
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(40),
  },
  title: {
    color: '#fff',
    fontSize: normalize(24),
    fontWeight: '700',
    marginBottom: normalize(10),
    textAlign: 'center',
  },
  description: {
    color: '#aaa',
    fontSize: normalize(14),
    marginBottom: normalize(30),
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: normalize(16),
    marginBottom: normalize(20),
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '700',
  },
  cardText: {
    color: '#00c853',
    fontSize: normalize(14),
    fontWeight: '600',
  },
});
