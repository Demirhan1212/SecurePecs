import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';
import { useRoute } from '@react-navigation/native';
import ImageViewing from 'react-native-image-viewing';

const { height: screenHeight } = Dimensions.get('window');

const PhishingSimulatorScreen = () => {
  const route = useRoute();
  const { level } = route.params as { level: string };

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await firestore()
          .collection('phishing_questions')
          .where('level', '==', level)
          .orderBy('createdAt', 'desc')
          .get();

        if (!snapshot.empty) {
          setQuestions(snapshot.docs.map(doc => doc.data()));
        }
      } catch (err) {
        console.error(' Firebase Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  const handleSelection = (option: string) => {
    setSelected(option);
    const isCorrect = option === questions[currentIndex].correctAnswer;
    setScore(prev => prev + (isCorrect ? 5 : -5));
    setModalVisible(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setModalVisible(false);
    } else {
      setModalVisible(false);
      setShowFinishModal(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.emptyText}>No simulation found for this level.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selected === currentQuestion.correctAnswer;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />

      <View style={styles.container}>
        <Text style={styles.title}>🧪 Phishing Simulation</Text>
        <Text style={styles.subtitle}>Question {currentIndex + 1} of {questions.length}</Text>

        <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
          <View style={styles.emailContainer}>
            <Image
              source={{ uri: currentQuestion.imageUrl }}
              style={styles.emailImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <ImageViewing
          images={[{ uri: currentQuestion.imageUrl }]}
          imageIndex={0}
          visible={imageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
          backgroundColor="#000"
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.choiceButton, styles.legitButton]}
            onPress={() => handleSelection('Legitimate')}
            disabled={selected !== null}
          >
            <Text style={styles.choiceText}>Legitimate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choiceButton, styles.phishingButton]}
            onPress={() => handleSelection('Phishing')}
            disabled={selected !== null}
          >
            <Text style={styles.choiceText}>Phishing</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: isCorrect ? '#00c853' : '#d50000' }]}> 
                {isCorrect ? '✅ Correct' : '❌ Incorrect'}
              </Text>
              <Text style={styles.modalText}>{currentQuestion.explanation}</Text>
              <Text style={styles.scoreText}>Score: {score}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={nextQuestion}
              >
                <Text style={styles.modalButtonText}>
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Simulation'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showFinishModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🎉 Simulation Complete</Text>
              <Text style={styles.modalText}>Your Score: {score}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowFinishModal(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default PhishingSimulatorScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  backButton: { position: 'absolute', top: normalize(10), left: normalize(16), zIndex: 10 },
  container: {
    flex: 1,
    paddingTop: normalize(70),
    paddingHorizontal: normalize(24),
    justifyContent: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: normalize(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  subtitle: {
    color: '#ccc',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  emailContainer: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(10),
    padding: normalize(12),
    marginBottom: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: screenHeight * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emailImage: {
    width: '100%',
    aspectRatio: 1.8,
    borderRadius: normalize(8),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  choiceButton: {
    flex: 0.48,
    padding: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  legitButton: { backgroundColor: '#4caf50' },
  phishingButton: { backgroundColor: '#e53935' },
  choiceText: { color: '#fff', fontWeight: 'bold', fontSize: normalize(14) },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: normalize(24),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    padding: normalize(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  modalText: {
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10),
    color: '#333',
  },
  scoreText: {
    fontSize: normalize(14),
    color: '#555',
    marginBottom: normalize(10),
  },
  modalButton: {
    backgroundColor: '#0a0a0a',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(10),
    marginTop: normalize(10),
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  emptyText: {
    color: '#999',
    fontSize: normalize(14),
  },
});
