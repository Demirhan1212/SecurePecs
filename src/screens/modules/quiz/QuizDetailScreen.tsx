import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const QuizDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { level } = route.params as { level: string };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const snapshot = await firestore()
          .collection('quizzes')
          .where('type', '==', 'quiz')
          .where('level', '==', level)
          .orderBy('createdAt', 'desc')
          .get();

        if (snapshot.empty) {
          setQuestions([]);
          return;
        }

        const firstQuiz = snapshot.docs[0].data() as any;
        setQuestions(firstQuiz.questions || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        Alert.alert('Error', 'Failed to load quizzes.');
      }
    };

    fetchQuizzes();
  }, [level]);

  const handleOptionSelect = (index: number) => {
    if (showAnswer) return;
    setSelected(index);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      Alert.alert('🎉 Quiz Complete', 'You have completed all questions.');
      navigation.goBack();
    }
  };

  const current = questions[currentIndex];
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  // Display level text at top
  const displayLevel = level
    .replace('personal', 'Personal')
    .replace('corporate', 'Corporate')
    .replace('_basic', ' - Beginner')
    .replace('_intermediate', ' - Intermediate')
    .replace('_advanced', ' - Advanced');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      <View style={{ paddingTop: normalize(80) }}>
        {!current ? (
          <Text style={styles.noQuiz}>No quizzes found for this level.</Text>
        ) : (
          <>
            <Text style={styles.levelText}>{displayLevel}</Text>

            <View style={styles.progressSection}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.questionCount}>
                {currentIndex + 1} / {questions.length}
              </Text>
            </View>

            <Text style={styles.questionText}>{current.question}</Text>

            {current.options.map((option, idx) => {
              const isCorrect = idx === current.answer;
              const isSelected = idx === selected;
              let bgColor = '#1c1c1e';
              let borderColor = '#444';

              if (showAnswer) {
                if (isCorrect) {
                  bgColor = '#2e7d32';
                  borderColor = '#66bb6a';
                } else if (isSelected) {
                  bgColor = '#b71c1c';
                  borderColor = '#ef5350';
                }
              } else if (isSelected) {
                bgColor = '#ffcc00';
                borderColor = '#ffcc00';
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionCard,
                    { backgroundColor: bgColor, borderColor },
                  ]}
                  onPress={() => handleOptionSelect(idx)}
                  disabled={showAnswer}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}

            {showAnswer && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextText}>
                  {currentIndex + 1 < questions.length ? 'Next' : 'Finish'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default QuizDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: normalize(24),
    backgroundColor: '#0a0a0a',
  },
  levelText: {
    color: '#ffcc00',
    fontSize: normalize(14),
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: normalize(12),
  },
  progressSection: {
    marginBottom: normalize(20),
  },
  progressBarContainer: {
    height: normalize(8),
    backgroundColor: '#333',
    borderRadius: normalize(10),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffcc00',
  },
  questionCount: {
    color: '#aaa',
    fontSize: normalize(14),
    textAlign: 'right',
    marginTop: normalize(6),
    marginBottom: normalize(12),
  },
  questionText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(20),
  },
  optionCard: {
    padding: normalize(14),
    borderRadius: normalize(12),
    borderWidth: 2,
    marginBottom: normalize(12),
    elevation: 2,
  },
  optionText: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#00c853',
    paddingVertical: normalize(14),
    borderRadius: normalize(12),
    alignItems: 'center',
    marginTop: normalize(20),
  },
  nextText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '700',
  },
  noQuiz: {
    color: '#aaa',
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(100),
  },
});
