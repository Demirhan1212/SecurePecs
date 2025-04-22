import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';
import PhishingQuestionForm from '../../components/PhishingQuestionForm';

type PhishingQuestion = {
  id: string;
  imageUrl: string;
  correctAnswer: string;
  explanation: string;
};

const PhishingSimulatorManager = () => {
  const [questions, setQuestions] = useState<PhishingQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<PhishingQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsub = firestore()
      .collection('phishing_questions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<PhishingQuestion, 'id'>),
        }));
        setQuestions(data);
      });
    return () => unsub();
  }, []);

  const openAddForm = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const openEditForm = (question: PhishingQuestion) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const deleteQuestion = (id: string) => {
    Alert.alert('Delete Question', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => firestore().collection('phishing_questions').doc(id).delete(),
      },
    ]);
  };

  const saveQuestion = async (imageUrl: string, correctAnswer: string, explanation: string) => {
    if (editingQuestion) {
      await firestore().collection('phishing_questions').doc(editingQuestion.id).update({
        imageUrl, correctAnswer, explanation,
      });
    } else {
      await firestore().collection('phishing_questions').add({
        imageUrl, correctAnswer, explanation, createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🐟 Phishing Simulator Manager</Text>

        <TouchableOpacity style={styles.addButton} onPress={openAddForm}>
          <Text style={styles.addButtonText}>➕ Add New Question</Text>
        </TouchableOpacity>

        {questions.map(q => (
          <View key={q.id} style={styles.card}>
            <Text style={styles.cardText}>{q.correctAnswer}</Text>
            <Text style={styles.cardExplanation}>{q.explanation}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditForm(q)}>
                <Text style={styles.actionText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteQuestion(q.id)}>
                <Text style={styles.actionText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal transparent animationType="slide" visible={isModalOpen}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>{editingQuestion ? 'Edit Question' : 'Add New Question'}</Text>

            <PhishingQuestionForm
              initialData={editingQuestion || undefined}
              onSave={saveQuestion}
            />

            <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PhishingSimulatorManager;

// STYLES (QuizManagerScreen'den uyarladım senin için.)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { paddingHorizontal: normalize(24), paddingTop: normalize(20) },
  title: { color: '#fff', fontSize: normalize(22), fontWeight: '700', marginVertical: normalize(20), textAlign: 'center' },
  addButton: { backgroundColor: '#ffcc00', padding: normalize(12), borderRadius: normalize(10), marginBottom: normalize(20) },
  addButtonText: { color: '#000', fontSize: normalize(16), fontWeight: '600', textAlign: 'center' },
  card: { backgroundColor: '#1c1c1e', padding: normalize(14), borderRadius: normalize(10), marginBottom: normalize(14) },
  cardText: { color: '#fff', fontWeight: '700', marginBottom: normalize(6) },
  cardExplanation: { color: '#aaa', fontSize: normalize(14), marginBottom: normalize(10) },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: normalize(12) },
  editBtn: { padding: normalize(6), backgroundColor: '#00aaff', borderRadius: normalize(6) },
  deleteBtn: { padding: normalize(6), backgroundColor: '#ff5252', borderRadius: normalize(6) },
  actionText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: normalize(20) },
  modalBox: { backgroundColor: '#1f1f1f', borderRadius: normalize(12), padding: normalize(20) },
  modalHeader: { fontSize: normalize(18), color: '#fff', fontWeight: '700', marginBottom: normalize(12), textAlign: 'center' },
  modalCancel: { marginTop: normalize(10), backgroundColor: '#888', padding: normalize(10), borderRadius: normalize(8) },
  modalCancelText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
});
