import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalize } from '../utils/normalize';

type Props = {
  initialData?: {
    imageUrl: string;
    correctAnswer: string;
    explanation: string;
  };
  onSave: (imageUrl: string, correctAnswer: string, explanation: string) => void;
};

const PhishingQuestionForm: React.FC<Props> = ({ initialData, onSave }) => {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || 'Phishing');
  const [explanation, setExplanation] = useState(initialData?.explanation || '');

  const handleSave = () => {
    if (!imageUrl.trim() || !explanation.trim()) return;
    onSave(imageUrl, correctAnswer, explanation);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Image URL"
        placeholderTextColor="#888"
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <View style={styles.answerContainer}>
        {['Phishing', 'Legitimate'].map(answer => (
          <TouchableOpacity
            key={answer}
            style={[
              styles.answerButton,
              correctAnswer === answer && styles.selectedAnswer,
            ]}
            onPress={() => setCorrectAnswer(answer)}
          >
            <Text
              style={[
                styles.answerText,
                correctAnswer === answer && styles.selectedAnswerText,
              ]}
            >
              {answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Explanation"
        placeholderTextColor="#888"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={explanation}
        onChangeText={setExplanation}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhishingQuestionForm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2a2a2e',
    color: '#fff',
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(12),
    fontSize: normalize(15),
  },
  textArea: {
    height: normalize(100),
    textAlignVertical: 'top',
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
  },
  answerButton: {
    flex: 1,
    backgroundColor: '#2a2a2e',
    paddingVertical: normalize(10),
    marginHorizontal: normalize(5),
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  selectedAnswer: {
    backgroundColor: '#ffcc00',
  },
  answerText: {
    color: '#fff',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  selectedAnswerText: {
    color: '#000',
  },
  saveBtn: {
    backgroundColor: '#00c853',
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginTop: normalize(8),
  },
  saveBtnText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '700',
  },
});
