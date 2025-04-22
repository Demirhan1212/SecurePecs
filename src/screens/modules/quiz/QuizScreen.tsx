import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';

interface Quiz {
  id: string;
  title?: string;
  questions: any[];
}

const QuizScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { level } = route.params as { level: string };

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('quizzes')
      .where('type', '==', 'quiz')
      .where('level', '==', level)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const raw = doc.data() as any;
          return {
            id: doc.id,
            title: raw.title || raw.name || 'Untitled Quiz',
            questions: raw.questions || [],
          };
        });
        setQuizzes(data);
      });

    return () => unsubscribe();
  }, [level]);

  const formattedLevel = level
    .replace('personal', 'Personal')
    .replace('corporate', 'Corporate')
    .replace('_basic', ' - Beginner')
    .replace('_intermediate', ' - Intermediate')
    .replace('_advanced', ' - Advanced');

  const startQuiz = (quizId: string) => {
    navigation.navigate('QuizDetailScreen' as never, { level, quizId } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a0a0a"
        translucent={false}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton />
        <View style={{ paddingTop: normalize(80) }}>
          <Text style={styles.topLabel}>Quiz</Text>

          <Text style={styles.title}>
            Challenge Your Skills{'\n'}
            <Text style={styles.bold}>{formattedLevel}</Text>
          </Text>

          <Text style={styles.description}>
            Test your knowledge with real-world scenarios tailored to your level.
          </Text>

          {quizzes.map(quiz => (
            <View key={quiz.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Image
                  source={require('../../../assets/quiz_icon.png')}
                  style={styles.cardIcon}
                />
              </View>

              <View style={styles.cardCenter}>
                <Text style={styles.cardTitle}>{quiz.title}</Text>
                <Text style={styles.cardSubtext}>
                  {quiz.questions.length} questions
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startQuiz(quiz.id)}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          ))}

          {quizzes.length === 0 && (
            <Text style={styles.emptyText}>
              No quizzes found for this level.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
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
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLeft: {
    marginRight: normalize(12),
  },
  cardIcon: {
    width: normalize(36),
    height: normalize(36),
    resizeMode: 'contain',
  },
  cardCenter: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  cardSubtext: {
    color: '#aaa',
    fontSize: normalize(13),
  },
  startButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
  },
  startButtonText: {
    color: '#000',
    fontSize: normalize(14),
    fontWeight: '700',
  },
  emptyText: {
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: normalize(20),
  },
});
