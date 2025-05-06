import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';
import QuestionForm from '../../components/QuestionForm';



type Module = {
  id: string;
  title: string;
  content: string;
  level: string;
};

const levels = [
  'personal_beginner',
  'personal_intermediate',
  'personal_advanced',
  'corporate_beginner',
  'corporate_intermediate',
  'corporate_advanced',
];

const ContentManagerScreen = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formLevel, setFormLevel] = useState(levels[0]);

  // subscribe
  useEffect(() => {
    const unsub = firestore()
      .collection('modules')
      .where('type', '==', 'learn')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const list = snap.docs.map(doc => {
          const raw = doc.data() as any;
          return {
            id: doc.id,
            title: raw.title,
            content: raw.content,
            level: raw.level,
          };
        });
        setModules(list);
      });
    return () => unsub();
  }, []);


  useEffect(() => {
    if (selectedModule) {
      setFormTitle(selectedModule.title);
      setFormContent(selectedModule.content);
      setFormLevel(selectedModule.level);
    } else {
      // reset for new
      setFormTitle('');
      setFormContent('');
      setFormLevel(levels[0]);
    }
  }, [selectedModule]);

  const toggleDropdown = () => setDropdownOpen(o => !o);
  const pickModule = (m: Module) => {
    setSelectedModule(m);
    setDropdownOpen(false);
  };

  const saveModule = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      Alert.alert('Missing Fields', 'Please fill title and content');
      return;
    }
    try {
      if (selectedModule) {
        await firestore().collection('modules').doc(selectedModule.id).update({
          title: formTitle,
          content: formContent,
          level: formLevel,
        });
        Alert.alert('Success', 'Module updated');
      } else {
        await firestore().collection('modules').add({
          title: formTitle,
          content: formContent,
          level: formLevel,
          type: 'learn',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Success', 'Module added');
      }
      // keep selectedModule or clear
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const deleteModule = () => {
    if (!selectedModule) return;
    Alert.alert('Delete Module', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await firestore().collection('modules').doc(selectedModule.id).delete();
          setSelectedModule(null);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Module</Text>
        <TouchableOpacity style={styles.selector} onPress={toggleDropdown}>
          <Text style={styles.selectorText}>{selectedModule?.title || 'Tap to choose...'}</Text>
          <Text style={styles.selectorArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdown}>
            {modules.map(m => (
              <TouchableOpacity key={m.id} style={styles.dropdownItem} onPress={() => pickModule(m)}>
                <Text style={styles.dropdownText}>{m.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionLabel}>{selectedModule ? 'Edit Module' : 'New Module'}</Text>
        <TextInput value={formTitle} onChangeText={setFormTitle} placeholder="Title" style={styles.input} placeholderTextColor="#888" />
        <TextInput value={formContent} onChangeText={setFormContent} placeholder="Content" style={[styles.input, {height: normalize(100)}]} placeholderTextColor="#888" multiline />
        <Text style={styles.label}>Level</Text>
        <View style={styles.toggleButtons}>
          {levels.map(l => (
            <TouchableOpacity key={l} style={[styles.toggleButton, formLevel===l && styles.activeButton]} onPress={()=>setFormLevel(l)}>
              <Text style={[styles.toggleText, formLevel===l && styles.activeText]}>{l.replace('_',' - ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={saveModule}><Text style={styles.saveText}>{selectedModule?'Update':'Add'}</Text></TouchableOpacity>
          {selectedModule && <TouchableOpacity style={styles.delBtn} onPress={deleteModule}><Text style={styles.delText}>Delete</Text></TouchableOpacity>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContentManagerScreen;

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
  sectionLabel:{color:'#fff',fontSize:normalize(18),fontWeight:'700',marginTop:normalize(20),marginBottom:normalize(12)},
  input:{backgroundColor:'#1c1c1e',color:'#fff',padding:normalize(12),borderRadius:normalize(8),fontSize:normalize(14),marginBottom:normalize(12)},
  toggleButtons:{flexDirection:'row',flexWrap:'wrap',gap:normalize(8),marginBottom:normalize(20)},
  toggleButton:{paddingVertical:normalize(6),paddingHorizontal:normalize(10),borderRadius:normalize(8),backgroundColor:'#1c1c1e',marginRight:normalize(8)},
  activeButton:{backgroundColor:'#ffcc00'},
  toggleText:{color:'#ccc',fontSize:normalize(13)},
  activeText:{color:'#000'},
  buttonRow:{flexDirection:'row',justifyContent:'flex-end',gap:normalize(12)},
  saveBtn:{backgroundColor:'#00c853',padding:normalize(12),borderRadius:normalize(8)},
  saveText:{color:'#fff',fontWeight:'700'},
  delBtn:{backgroundColor:'#ff5555',padding:normalize(12),borderRadius:normalize(8)},
  delText:{color:'#fff',fontWeight:'700'},
});
