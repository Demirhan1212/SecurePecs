import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Alert, FlatList, Image, StatusBar, ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import PhishingQuestionForm from '../../components/PhishingQuestionForm';
import BackButton from '../../components/BackButton';

const LEVELS = [
  'personal_beginner',
  'personal_intermediate',
  'personal_advanced',
  'corporate_beginner',
  'corporate_intermediate',
  'corporate_advanced',
];

const PhishingManagerScreen = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [level, setLevel] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (lvl: string) => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection('phishing_questions')
        .where('level', '==', lvl)
        .where('createdAt', '!=', null)
        .orderBy('createdAt', 'desc')
        .get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load questions.');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (level) fetchQuestions(level);
  }, [level]);

  const openEditModal = (question: any) => {
    setSelectedQuestion(question);
    setIsEditing(true);
    setModalVisible(true);
  };

  const openNewModal = () => {
    setSelectedQuestion(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleSave = async (imageUrl: string, correctAnswer: string, explanation: string) => {
    if (isEditing && selectedQuestion) {
      await firestore().collection('phishing_questions').doc(selectedQuestion.id).update({
        imageUrl,
        correctAnswer,
        explanation,
      });
    } else {
      await firestore().collection('phishing_questions').add({
        imageUrl,
        correctAnswer,
        explanation,
        level,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    setModalVisible(false);
    fetchQuestions(level);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await firestore().collection('phishing_questions').doc(id).delete();
          fetchQuestions(level);
        }
      }
    ]);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />

      <View style={styles.container}>
        <Text style={styles.label}>📂 Select Level</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Text style={styles.selectorText}>{level ? level.replace('_', ' - ') : 'Tap to choose a level...'}</Text>
          <Text style={styles.selectorArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdown}>
            {LEVELS.map(lvl => (
              <TouchableOpacity key={lvl} style={styles.dropdownItem} onPress={() => {
                setLevel(lvl);
                setDropdownOpen(false);
              }}>
                <Text style={styles.dropdownText}>{lvl.replace('_', ' - ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {level !== '' && (
          <>
            <TouchableOpacity style={styles.addBtn} onPress={openNewModal}>
              <Text style={styles.addBtnText}>➕ Add New Question</Text>
            </TouchableOpacity>
            {loading ? (
              <ActivityIndicator size="large" color="#00c853" />
            ) : questions.length === 0 ? (
              <Text style={styles.emptyState}>🕵️ No questions available for this level.</Text>
            ) : (
              <FlatList
                data={questions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.questionCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.previewImage} />
                    <View style={styles.cardContent}>
                      <Text style={styles.questionAnswer}>✅ Answer: {item.correctAnswer}</Text>
                      <Text numberOfLines={2} style={styles.questionExplanation}>{item.explanation}</Text>
                      <View style={styles.rowActions}>
                        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                          <Text style={styles.btnText}>✏️ Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                          <Text style={styles.btnText}>🗑️ Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>{isEditing ? 'Edit Question' : 'Add Question'}</Text>
            <PhishingQuestionForm initialData={selectedQuestion} onSave={handleSave} />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhishingManagerScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  backButton: { position: 'absolute', top: normalize(10), left: normalize(16), zIndex: 10 },
  container: { flex: 1, paddingTop: normalize(80), paddingHorizontal: normalize(24), paddingBottom: normalize(40) },
  label: { color: '#ccc', fontSize: normalize(16), marginBottom: normalize(8), fontWeight: 'bold' },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f1f1f', padding: normalize(14), borderRadius: normalize(10) },
  selectorText: { color: '#fff', fontSize: normalize(15) },
  selectorArrow: { color: '#888' },
  dropdown: { backgroundColor: '#2a2a2e', borderRadius: normalize(8), marginTop: normalize(4), maxHeight: normalize(200) },
  dropdownItem: { padding: normalize(12), borderBottomWidth: 1, borderBottomColor: '#3a3a3a' },
  dropdownText: { color: '#fff', fontSize: normalize(14) },
  addBtn: { backgroundColor: '#4caf50', padding: normalize(12), borderRadius: normalize(10), alignItems: 'center', marginVertical: normalize(20), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  addBtnText: { color: '#fff', fontSize: normalize(16), fontWeight: 'bold' },
  questionCard: { flexDirection: 'row', backgroundColor: '#1f1f1f', padding: normalize(14), borderRadius: normalize(12), marginBottom: normalize(14), alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  previewImage: { width: normalize(64), height: normalize(64), borderRadius: normalize(10), backgroundColor: '#ccc' },
  cardContent: { flex: 1, marginLeft: normalize(12) },
  questionAnswer: { color: '#4caf50', fontWeight: 'bold', marginBottom: normalize(4), fontSize: normalize(14) },
  questionExplanation: { color: '#aaa', fontSize: normalize(13), marginBottom: normalize(8) },
  rowActions: { flexDirection: 'row' },
  editBtn: { backgroundColor: '#ffcc00', paddingVertical: normalize(6), paddingHorizontal: normalize(12), borderRadius: normalize(6), marginRight: normalize(10) },
  deleteBtn: { backgroundColor: '#f44336', paddingVertical: normalize(6), paddingHorizontal: normalize(12), borderRadius: normalize(6) },
  btnText: { color: '#000', fontWeight: '600' },
  emptyState: { color: '#999', textAlign: 'center', marginTop: 20, fontSize: normalize(14) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: normalize(20) },
  modalBox: { width: '100%', backgroundColor: '#1f1f1f', borderRadius: normalize(12), padding: normalize(20) },
  modalHeader: { fontSize: normalize(18), color: '#fff', fontWeight: '700', marginBottom: normalize(12), textAlign: 'center' },
  modalCancel: { marginTop: normalize(10), backgroundColor: '#888', padding: normalize(10), borderRadius: normalize(8) },
  modalCancelText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
});
