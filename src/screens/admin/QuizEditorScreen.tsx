import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';
import QuestionForm from '../../components/QuestionForm';

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const levelOptions = [
  { value: 'personal_basic', label: 'Personal - Beginner' },
  { value: 'personal_intermediate', label: 'Personal - Intermediate' },
  { value: 'personal_advanced', label: 'Personal - Advanced' },
  { value: 'corporate_basic', label: 'Corporate - Beginner' },
  { value: 'corporate_intermediate', label: 'Corporate - Intermediate' },
  { value: 'corporate_advanced', label: 'Corporate - Advanced' },
];

const QuizEditorScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(levelOptions[0].value);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddQuestion = (
    question: string,
    options: string[],
    answer: number
  ) => {
    setQuestions([...questions, { question, options, answer }]);
    setShowForm(false);
  };

  const handleDeleteQuestion = (index: number) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const copy = [...questions];
          copy.splice(index, 1);
          setQuestions(copy);
        },
      },
    ]);
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a quiz title.');
      return;
    }
    if (questions.length === 0) {
      Alert.alert('Validation', 'Please add at least one question.');
      return;
    }
    try {
      await firestore().collection('quizzes').add({
        title: title.trim(),
        level,
        type: 'quiz',
        createdAt: firestore.FieldValue.serverTimestamp(),
        questions,
      });
      Alert.alert('Success', 'Quiz created successfully!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a0a0a"
        translucent={false}
      />
      {/* Absolute Back Button */}
      <BackButton style={styles.backButton} />

      {/* Content with paddingTop so BackButton doesn't overlap */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Quiz Title */}
        <Text style={styles.sectionLabel}>Quiz Title</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter quiz title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Difficulty Level */}
        <Text style={styles.sectionLabel}>Select Difficulty Level</Text>
        <View style={styles.levelRow}>
          {levelOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.levelButton,
                level === opt.value && styles.activeLevelButton,
              ]}
              onPress={() => setLevel(opt.value)}
            >
              <Text
                style={[
                  styles.levelText,
                  level === opt.value && styles.activeLevelText,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Question */}
        <TouchableOpacity
          style={styles.addQuestionButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addQuestionText}>➕ Add New Question</Text>
        </TouchableOpacity>

        {showForm && (
          <QuestionForm onSave={handleAddQuestion} initialData={undefined} />
        )}

        {/* Questions Preview */}
        <Text style={styles.sectionLabel}>Questions Preview</Text>
        {questions.map((q, i) => (
          <View key={i} style={styles.questionItem}>
            <Text style={styles.qText} numberOfLines={2}>
              {i + 1}. {q.question}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteQuestion(i)}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuiz}>
          <Text style={styles.saveButtonText}>💾 Save Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizEditorScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + normalize(10) : normalize(10),
    left: normalize(16),
    zIndex: 100,
  },
  container: {
    paddingTop: normalize(70),
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(40),
    backgroundColor: '#0a0a0a',
  },
  sectionLabel: {
    color: '#ccc',
    fontSize: normalize(16),
    fontWeight: '600',
    marginTop: normalize(20),
    marginBottom: normalize(8),
  },
  inputContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(12),
    marginBottom: normalize(16),
  },
  input: {
    color: '#fff',
    height: normalize(48),
    fontSize: normalize(16),
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(10),
  },
  levelButton: {
    backgroundColor: '#2a2a2e',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(8),
    marginBottom: normalize(10),
  },
  activeLevelButton: {
    backgroundColor: '#ffcc00',
  },
  levelText: {
    color: '#ccc',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  activeLevelText: {
    color: '#000',
  },
  addQuestionButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  addQuestionText: {
    color: '#000',
    fontWeight: '700',
    fontSize: normalize(15),
  },
  questionItem: {
    backgroundColor: '#1c1c1e',
    padding: normalize(12),
    borderRadius: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
    elevation: 1,
  },
  qText: {
    flex: 1,
    color: '#fff',
    fontSize: normalize(14),
    marginRight: normalize(10),
  },
  deleteText: {
    color: '#ff5555',
    fontSize: normalize(18),
  },
  saveButton: {
    backgroundColor: '#00c853',
    paddingVertical: normalize(14),
    borderRadius: normalize(12),
    alignItems: 'center',
    marginTop: normalize(30),
    marginBottom: normalize(20),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '700',
  },
});
