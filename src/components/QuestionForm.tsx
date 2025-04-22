import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  onSave: (question: string, options: string[], answer: number) => void;
  initialData?: {
    question: string;
    options: string[];
    answer: number;
  };
};

const QuestionForm = ({ onSave, initialData }: Props) => {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [options, setOptions] = useState(initialData?.options || ['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState<number | null>(
    initialData?.answer ?? null
  );

  const handleSubmit = () => {
    if (!question || options.some((o) => o === '') || answerIndex === null) {
      alert('Please complete all fields and select the correct answer.');
      return;
    }

    onSave(question, options, answerIndex);
    // Reset form after saving
    setQuestion('');
    setOptions(['', '', '', '']);
    setAnswerIndex(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Question</Text>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        style={styles.input}
        placeholder="Enter question"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Options</Text>
      {options.map((opt, idx) => (
        <View key={idx} style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.radio,
              answerIndex === idx && styles.radioSelected,
            ]}
            onPress={() => setAnswerIndex(idx)}
          />
          <TextInput
            value={opt}
            onChangeText={(text) => {
              const copy = [...options];
              copy[idx] = text;
              setOptions(copy);
            }}
            style={styles.optionInput}
            placeholder={`Option ${idx + 1}`}
            placeholderTextColor="#888"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>✅ Add Question</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuestionForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2a2a2e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#ffcc00',
    borderColor: '#ffcc00',
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#2a2a2e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#ffcc00',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
