import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';
import QuestionForm from '../../components/QuestionForm';

// Question & Module types
interface Question {
  question: string;
  options: string[];
  answer: number;
}
interface Module {
  id: string;
  title: string;
  description: string;
  level: string;
  questions: Question[];
}

const levels = [
  'personal_beginner',
  'personal_intermediate',
  'personal_advanced',
  'corporate_beginner',
  'corporate_intermediate',
  'corporate_advanced',
];

const TrainingManagerScreen = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<Module | null>(null);

  // States for editing questions
  const [editData, setEditData] = useState<{
    moduleId: string;
    index: number;
    question: Question;
  } | null>(null);
  const [addQuestionModuleId, setAddQuestionModuleId] = useState<string | null>(null);

  // States for new/edit module metadata
  const [moduleModal, setModuleModal] = useState<{
    mode: 'create' | 'edit';
    title: string;
    description: string;
    level: string;
  } | null>(null);

  // Load modules
  useEffect(() => {
    const unsub = firestore()
      .collection('modules')
      .where('type', '==', 'training')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snap => {
          const data = snap.docs.map(doc => {
            const d = doc.data() as any;
            return {
              id: doc.id,
              title: d.title,
              description: d.description,
              level: d.level,
              questions: d.questions || [],
            } as Module;
          });
          setModules(data);
        },
        err => Alert.alert('Error', err.message)
      );
    return () => unsub();
  }, []);

  // Sync selected module
  useEffect(() => {
    if (selected) {
      const updated = modules.find(m => m.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [modules]);

  // Handlers
  const toggleDropdown = () => setDropdownOpen(open => !open);
  const onPickModule = (m: Module) => {
    setSelected(m);
    setDropdownOpen(false);
  };

  const onDeleteModule = () => {
    if (!selected) return;
    Alert.alert('Delete Module', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await firestore().collection('modules').doc(selected.id).delete();
          setSelected(null);
        },
      },
    ]);
  };

  const onStartCreateModule = () =>
    setModuleModal({ mode: 'create', title: '', description: '', level: levels[0] });

  const onStartEditModule = () =>
    selected &&
    setModuleModal({
      mode: 'edit',
      title: selected.title,
      description: selected.description,
      level: selected.level,
    });

  const onSaveModule = async () => {
    if (!moduleModal) return;
    const { mode, title, description, level } = moduleModal;
    if (!title.trim()) return Alert.alert('Validation', 'Title is required');
    try {
      if (mode === 'create') {
        const ref = await firestore().collection('modules').add({
          title: title.trim(),
          description: description.trim(),
          level,
          type: 'training',
          questions: [],
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setSelected({ id: ref.id, title, description, level, questions: [] });
      } else if (mode === 'edit' && selected) {
        await firestore().collection('modules').doc(selected.id).update({
          title: title.trim(),
          description: description.trim(),
          level,
        });
      }
      setModuleModal(null);
    } catch (err:any) {
      Alert.alert('Error', err.message);
    }
  };

  const onOpenEditQuestion = (idx: number) =>
    selected && setEditData({ moduleId: selected.id, index: idx, question: selected.questions[idx] });

  const onSaveEditQuestion = async (q: string, opts: string[], ans: number) => {
    if (!editData) return;
    const ref = firestore().collection('modules').doc(editData.moduleId);
    const snap = await ref.get();
    const arr: Question[] = (snap.data() as any).questions || [];
    arr[editData.index] = { question: q, options: opts, answer: ans };
    await ref.update({ questions: arr });
    setEditData(null);
  };

  const onStartAddQuestion = () => selected && setAddQuestionModuleId(selected.id);

  const onSaveAddQuestion = async (q: string, opts: string[], ans: number) => {
    if (!addQuestionModuleId) return;
    await firestore().collection('modules').doc(addQuestionModuleId).update({
      questions: firestore.FieldValue.arrayUnion({ question: q, options: opts, answer: ans }),
    });
    setAddQuestionModuleId(null);
  };

  const onDeleteQuestion = (q: Question) =>
    selected &&
    Alert.alert('Delete Question', 'Confirm delete?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await firestore().collection('modules').doc(selected.id).update({ questions: firestore.FieldValue.arrayRemove(q) });
      } },
    ]);

  const closeModals = () => {
    setModuleModal(null);
    setEditData(null);
    setAddQuestionModuleId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Actions */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Training Modules</Text>
          <TouchableOpacity style={styles.createBtn} onPress={onStartCreateModule}>
            <Text style={styles.createText}>➕ Module</Text>
          </TouchableOpacity>
        </View>

        {/* Module Dropdown */}
        <Text style={styles.label}>Select Module</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={toggleDropdown}>
          <Text style={styles.dropdownBtnText}>{selected?.title || 'Choose module...'}</Text>
          <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {modules.map(m => (
              <TouchableOpacity key={m.id} style={styles.dropdownItem} onPress={() => onPickModule(m)}>
                <Text style={styles.dropdownItemText}>{m.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected Module Details */}
        {selected && (
          <View style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>{selected.title}</Text>
              <View style={styles.moduleActions}>
                <TouchableOpacity onPress={onStartEditModule}>
                  <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeleteModule}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.moduleDesc}>{selected.description}</Text>
            <Text style={styles.moduleLevel}>Level: {selected.level.replace('_',' - ')}</Text>

            {/* Questions List */}
            {selected.questions.map((qq, i) => (
              <View key={i} style={styles.questionRow}>
                <Text style={styles.questionText}>{i+1}. {qq.question}</Text>
                <View style={styles.questionActions}>
                  <TouchableOpacity onPress={() => onOpenEditQuestion(i)}>
                    <Text style={styles.editText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteQuestion(qq)}>
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addQBtn} onPress={onStartAddQuestion}>
              <Text style={styles.addQText}>➕ Add Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Module Form Modal */}
      <Modal transparent animationType="slide" visible={!!moduleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{moduleModal?.mode === 'create' ? 'New Module' : 'Edit Module'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#888"
              value={moduleModal?.title}
              onChangeText={t => setModuleModal(prev => prev && { ...prev, title: t })}
            />
            <TextInput
              style={[styles.input, { height: normalize(80) }]}
              placeholder="Description"
              placeholderTextColor="#888"
              multiline
              value={moduleModal?.description}
              onChangeText={t => setModuleModal(prev => prev && { ...prev, description: t })}
            />
            <Text style={styles.label}>Level</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelRow}>
              {levels.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.levelBtn, moduleModal?.level === l && styles.levelActive]}
                  onPress={() => setModuleModal(prev => prev && { ...prev, level: l })}
                >
                  <Text style={[styles.levelText, moduleModal?.level === l && styles.levelTextActive]}>
                    {l.replace('_',' - ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={onSaveModule}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModals}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Question Form Modal */}
      <Modal transparent animationType="slide" visible={!!editData || !!addQuestionModuleId}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editData ? 'Edit Question' : 'Add Question'}</Text>
            <QuestionForm
              onSave={editData ? onSaveEditQuestion : onSaveAddQuestion}
              initialData={editData?.question}
            />
            <TouchableOpacity style={styles.cancelBtn} onPress={closeModals}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TrainingManagerScreen;

const styles = StyleSheet.create({
  safeArea: { flex:1, backgroundColor:'#0a0a0a' },
  backButton: { position:'absolute', top: Platform.OS==='android' ? StatusBar.currentHeight!+normalize(10) : normalize(10), left:normalize(16), zIndex:10 },
  container: { paddingTop:normalize(80), paddingHorizontal:normalize(24), paddingBottom:normalize(40) },

  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:normalize(20) },
  screenTitle: { color:'#ffcc00', fontSize:normalize(20), fontWeight:'700' },
  createBtn: { backgroundColor:'#00b0ff', padding:normalize(8), borderRadius:normalize(6) },
  createText: { color:'#fff', fontSize:normalize(14), fontWeight:'600' },

  label: { color:'#ccc', fontSize:normalize(16), marginBottom:normalize(8) },
  dropdownBtn: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#1c1c1e', padding:normalize(12), borderRadius:normalize(8) },
  dropdownBtnText: { color:'#fff', fontSize:normalize(15) },
  dropdownArrow: { color:'#888' },
  dropdownList: { backgroundColor:'#2a2a2e', borderRadius:normalize(8), marginTop:normalize(4), maxHeight:normalize(200) },
  dropdownItem: { padding:normalize(12), borderBottomWidth:1, borderBottomColor:'#3a3a3a' },
  dropdownItemText: { color:'#fff', fontSize:normalize(14) },

  moduleCard: { backgroundColor:'#1f1f1f', borderRadius:normalize(10), padding:normalize(16), marginTop:normalize(20), elevation:2 },
  moduleHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:normalize(12) },
  moduleTitle: { color:'#fff', fontSize:normalize(18), fontWeight:'700' },
  moduleActions: { flexDirection:'row' },
  moduleDesc: { color:'#aaa', fontSize:normalize(14), marginBottom:normalize(8) },
  moduleLevel: { color:'#ffcc00', fontSize:normalize(13), marginBottom:normalize(12) },

  questionRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#2a2a2e', borderRadius:normalize(8), padding:normalize(10), marginTop:normalize(6) },
  questionText: { color:'#fff', flex:1, marginRight:normalize(8) },
  questionActions: { flexDirection:'row' },
  editText: { color:'#00aaff', fontSize:normalize(18), marginRight:normalize(12) },
  deleteText: { color:'#ff5555', fontSize:normalize(18) },
  addQBtn: { marginTop:normalize(12), backgroundColor:'#00c853', padding:normalize(10), borderRadius:normalize(6), alignItems:'center' },
  addQText: { color:'#fff', fontWeight:'600' },

  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center', padding:normalize(20) },
  modalBox: { width:'100%', backgroundColor:'#1f1f1f', borderRadius:normalize(12), padding:normalize(20) },
  modalTitle: { color:'#fff', fontSize:normalize(18), fontWeight:'700', textAlign:'center', marginBottom:normalize(12) },

  input: { backgroundColor:'#2a2a2e', color:'#fff', padding:normalize(12), borderRadius:normalize(8), fontSize:normalize(14), marginBottom:normalize(12) },

  levelRow: { flexDirection:'row', paddingVertical:normalize(8), marginBottom:normalize(16) },
  levelBtn: { paddingVertical:normalize(6), paddingHorizontal:normalize(12), borderRadius:normalize(8), backgroundColor:'#2a2a2e', marginRight:normalize(8) },
  levelActive: { backgroundColor:'#ffcc00' },
  levelText: { color:'#ccc', fontSize:normalize(13) },
  levelTextActive: { color:'#000' },

  modalActions: { flexDirection:'row', justifyContent:'space-between' },
  saveBtn: { backgroundColor:'#00c853', padding:normalize(12), borderRadius:normalize(8), flex:1, marginRight:normalize(8) },
  saveText: { color:'#fff', fontWeight:'700', textAlign:'center' },
  cancelBtn: { backgroundColor:'#888', padding:normalize(12), borderRadius:normalize(8), flex:1 },
  cancelText: { color:'#fff', fontWeight:'700', textAlign:'center' },
});
