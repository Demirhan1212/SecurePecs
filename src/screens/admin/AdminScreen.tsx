import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';

const AdminScreen = () => {
  const navigation = useNavigation();
  const [quizMenuOpen, setQuizMenuOpen] = useState(false);
  const [trainingMenuOpen, setTrainingMenuOpen] = useState(false);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.topLabel}>Admin Panel</Text>
        <Text style={styles.title}>SecurePECS Admin Console</Text>
        <Text style={styles.description}>Select a section to manage:</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FeedbackManager' as never)}
        >
          <Text style={styles.buttonText}>🔎 View User Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ContentManager' as never)}
        >
          <Text style={styles.buttonText}>✏️ Manage Learning Content</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setQuizMenuOpen(!quizMenuOpen)}
        >
          <Text style={styles.buttonText}>
            🧠 Manage Quizzes {quizMenuOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {quizMenuOpen && (
          <View style={styles.subMenu}>
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => navigation.navigate('QuizEditor' as never)}
            >
              <Text style={styles.subButtonText}>➕ Create New Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subButton}
              onPress={() => navigation.navigate('QuizManager' as never)}
            >
              <Text style={styles.subButtonText}>🛠️ Edit or Delete Quizzes</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setTrainingMenuOpen(!trainingMenuOpen)}
        >
          <Text style={styles.buttonText}>
            🎮 Manage Training {trainingMenuOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {trainingMenuOpen && (
          <View style={styles.subMenu}>
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => setGameMenuOpen(!gameMenuOpen)}
            >
              <Text style={styles.subButtonText}>
                🎲 Edit Games {gameMenuOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {gameMenuOpen && (
              <>
                <TouchableOpacity
                  style={styles.subSubButton}
                  onPress={() => navigation.navigate('PhishingManager' as never)}
                >
                  <Text style={styles.subSubButtonText}>🐟 Phishing Simulator</Text>
                </TouchableOpacity>

              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminScreen;

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
  topLabel: {
    color: '#888',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '700',
    color: '#fff',
    marginBottom: normalize(5),
    textAlign: 'center',
  },
  description: {
    color: '#aaa',
    fontSize: normalize(15),
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1f1f1f',
    padding: normalize(16),
    borderRadius: normalize(12),
    marginBottom: normalize(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffcc00',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  subMenu: {
    marginBottom: normalize(16),
    paddingLeft: normalize(12),
  },
  subButton: {
    backgroundColor: '#2a2a2e',
    padding: normalize(14),
    borderRadius: normalize(10),
    marginTop: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  subButtonText: {
    color: '#fff',
    fontSize: normalize(15),
    textAlign: 'center',
  },
  subSubButton: {
    backgroundColor: '#3a3a3e',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginTop: normalize(6),
    marginLeft: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  subSubButtonText: {
    color: '#ddd',
    fontSize: normalize(14),
    textAlign: 'center',
  },
});
