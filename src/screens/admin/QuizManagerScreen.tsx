import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';
import QuestionForm from '../../components/QuestionForm';

type Question = { question: string; options: string[]; answer: number };
type Quiz = { id: string; title: string; level: string; questions: Question[] };

const QuizManagerScreen = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editData, setEditData] = useState<{ quizId: string; index: number; question: Question } | null>(null);
  const [addQuizId, setAddQuizId] = useState<string | null>(null);

  // Subscribe to quizzes and update list
  useEffect(() => {
    const unsub = firestore()
      .collection('quizzes')
      .where('type', '==', 'quiz')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => {
          const raw = doc.data() as any;
          return {
            id: doc.id,
            title: raw.title || 'Untitled Quiz',
            level: raw.level,
            questions: raw.questions || [],
          };
        });
        setQuizzes(list);
      }, err => Alert.alert('Error', err.message));
    return () => unsub();
  }, []);

  // Whenever quizzes update, refresh selectedQuiz questions in real-time
  useEffect(() => {
    if (selectedQuiz) {
      const updated = quizzes.find(q => q.id === selectedQuiz.id);
      if (updated) setSelectedQuiz(updated);
    }
  }, [quizzes]);

  const toggleDropdown = () => setDropdownOpen(open => !open);
  const pickQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setDropdownOpen(false);
  };

  const openEdit = (index: number) => {
    if (!selectedQuiz) return;
    setEditData({ quizId: selectedQuiz.id, index, question: selectedQuiz.questions[index] });
  };

  const saveEdit = async (q: string, opts: string[], ans: number) => {
    if (!editData) return;
    const { quizId, index } = editData;
    const ref = firestore().collection('quizzes').doc(quizId);
    const doc = await ref.get();
    const data = doc.data() as any;
    const arr: Question[] = data.questions;
    arr[index] = { question: q, options: opts, answer: ans };
    await ref.update({ questions: arr });
    setEditData(null);
  };

  const openAdd = () => selectedQuiz && setAddQuizId(selectedQuiz.id);
  const saveAdd = async (q: string, opts: string[], ans: number) => {
    if (!addQuizId) return;
    await firestore().collection('quizzes').doc(addQuizId).update({
      questions: firestore.FieldValue.arrayUnion({ question: q, options: opts, answer: ans }),
    });
    setAddQuizId(null);
  };

  const deleteQuiz = () => {
    if (!selectedQuiz) return;
    Alert.alert('Delete Quiz', 'Remove this quiz?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await firestore().collection('quizzes').doc(selectedQuiz.id).delete();
        setSelectedQuiz(null);
      } }
    ]);
  };

  const deleteQuestion = (q: Question) => {
    if (!selectedQuiz) return;
    Alert.alert('Delete Question', 'Remove this question?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await firestore().collection('quizzes').doc(selectedQuiz.id).update({
          questions: firestore.FieldValue.arrayRemove(q)
        });
      } }
    ]);
  };

  const closeModal = () => { setEditData(null); setAddQuizId(null); };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Quiz</Text>
        <TouchableOpacity style={styles.selector} onPress={toggleDropdown}>
          <Text style={styles.selectorText}>{selectedQuiz?.title || 'Tap to choose...'}</Text>
          <Text style={styles.selectorArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdown}>
            {quizzes.map(q => (
              <TouchableOpacity key={q.id} style={styles.dropdownItem} onPress={() => pickQuiz(q)}>
                <Text style={styles.dropdownText}>{q.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedQuiz && (
          <View style={styles.detailBox}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selectedQuiz.title}</Text>
              <Text style={styles.detailLevel}>{selectedQuiz.level.replace('_',' - ')}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={openAdd}><Text style={styles.actionText}>Add Q</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={deleteQuiz}><Text style={styles.actionText}>Delete Quiz</Text></TouchableOpacity>
            </View>
            {selectedQuiz.questions.map((qq,i) => (
              <View key={i} style={styles.questionRow}>
                <Text style={styles.questionText}>{i+1}. {qq.question}</Text>
                <View style={styles.rowActions}>
                  <TouchableOpacity onPress={() => openEdit(i)}><Text style={styles.editText}>✏️</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteQuestion(qq)}><Text style={styles.deleteText}>🗑️</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal transparent animationType="slide" visible={!!editData || !!addQuizId}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>{editData ? 'Edit Question' : 'Add Question'}</Text>
            <QuestionForm
              onSave={editData ? saveEdit : saveAdd}
              initialData={editData?.question}
            />
            <TouchableOpacity onPress={closeModal} style={styles.modalCancel}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuizManagerScreen;

const styles = StyleSheet.create({
  safeArea:{flex:1,backgroundColor:'#0a0a0a'},
  backButton:{position:'absolute',top:Platform.OS==='android'?StatusBar.currentHeight!+10:10,left:normalize(16),zIndex:10},
  container:{paddingTop:normalize(80),paddingHorizontal:normalize(24),paddingBottom:normalize(40)},
  label:{color:'#ccc',fontSize:normalize(16),marginBottom:normalize(8)},
  selector:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#1c1c1e',padding:normalize(12),borderRadius:normalize(8)},
  selectorText:{color:'#fff',fontSize:normalize(15)},
  selectorArrow:{color:'#888'},
  dropdown:{backgroundColor:'#2a2a2e',borderRadius:normalize(8),marginTop:normalize(4),maxHeight:normalize(200)},
  dropdownItem:{padding:normalize(12),borderBottomWidth:1,borderBottomColor:'#3a3a3a'},
  dropdownText:{color:'#fff',fontSize:normalize(14)},
  detailBox:{backgroundColor:'#1f1f1f',borderRadius:normalize(10),padding:normalize(12),marginTop:normalize(16)},
  detailHeader:{flexDirection:'row',justifyContent:'space-between',marginBottom:normalize(12)},
  detailTitle:{color:'#fff',fontSize:normalize(18),fontWeight:'700'},
  detailLevel:{color:'#ffcc00',fontSize:normalize(14)},
  actionRow:{flexDirection:'row',justifyContent:'flex-end',marginBottom:normalize(10)},
  actionBtn:{backgroundColor:'#ffcc00',padding:normalize(8),borderRadius:normalize(6),marginLeft:normalize(8)},
  actionText:{color:'#000',fontSize:normalize(14),fontWeight:'600'},
  questionRow:{backgroundColor:'#2a2a2e',borderRadius:normalize(8),padding:normalize(10),flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:normalize(6)},
  questionText:{color:'#fff',flex:1,marginRight:normalize(8)},
  rowActions:{flexDirection:'row'},
  editText:{color:'#00aaff',marginRight:normalize(8)},
  deleteText:{color:'#ff5555'},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',alignItems:'center',padding:normalize(20)},
  modalBox:{width:'100%',backgroundColor:'#1f1f1f',borderRadius:normalize(12),padding:normalize(20)},
  modalHeader:{fontSize:normalize(18),color:'#fff',fontWeight:'700',marginBottom:normalize(12),textAlign:'center'},
  modalCancel:{marginTop:normalize(10),backgroundColor:'#888',padding:normalize(10),borderRadius:normalize(8)},
  modalCancelText:{textAlign:'center',color:'#fff',fontWeight:'600'}
});
