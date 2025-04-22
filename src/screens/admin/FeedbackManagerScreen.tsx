import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../utils/normalize';
import BackButton from '../../components/BackButton';

const FeedbackManagerScreen = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('feedback')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const raw = doc.data();
          return {
            id: doc.id,
            uid: raw.uid,
            message: raw.message,
            createdAt: raw.createdAt?.toDate().toLocaleString() || '-',
          };
        });
        setFeedbackList(data);
      });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <BackButton style={styles.backButton} />

      <Text style={styles.title}>📩 Feedback Submissions</Text>

      <FlatList
        data={feedbackList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          feedbackList.length ? styles.listContainer : styles.emptyContainer
        }
        ListEmptyComponent={<Text style={styles.empty}>No feedback submitted yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedFeedback(item)}>
            <View style={styles.cardHeader}>
              <Text style={styles.uid} numberOfLines={1} ellipsizeMode="middle">{item.uid}</Text>
              <Text style={styles.timestamp}>{item.createdAt}</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.messagePreview}
            >
              {item.message}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedFeedback} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalUid}>From: {selectedFeedback?.uid}</Text>
            <Text style={styles.modalTimestamp}>{selectedFeedback?.createdAt}</Text>
            <Text style={styles.modalMessage}>{selectedFeedback?.message}</Text>
            <TouchableOpacity
              onPress={() => setSelectedFeedback(null)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FeedbackManagerScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + normalize(10) : normalize(10),
    left: normalize(16),
    zIndex: 10,
  },
  title: {
    marginTop: normalize(60),
    marginBottom: normalize(20),
    alignSelf: 'center',
    fontSize: normalize(24),
    fontWeight: '700',
    color: '#ffcc00',
  },
  listContainer: {
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(40),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#aaa',
    fontSize: normalize(14),
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: normalize(10),
    padding: normalize(16),
    marginVertical: normalize(8),
    marginHorizontal: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(6),
  },
  uid: {
    flex: 1,
    color: '#ccc',
    fontSize: normalize(13),
    fontWeight: '600',
    marginRight: normalize(8),
  },
  timestamp: {
    flexShrink: 0,
    color: '#888',
    fontSize: normalize(12),
  },
  messagePreview: {
    color: '#fff',
    fontSize: normalize(14),
    lineHeight: normalize(20),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: normalize(24),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(20),
    alignItems: 'flex-start',
  },
  modalUid: {
    fontWeight: 'bold',
    fontSize: normalize(14),
    marginBottom: normalize(4),
  },
  modalTimestamp: {
    color: '#666',
    fontSize: normalize(12),
    marginBottom: normalize(8),
  },
  modalMessage: {
    color: '#222',
    fontSize: normalize(14),
    marginBottom: normalize(16),
  },
  modalButton: {
    backgroundColor: '#0a0a0a',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(8),
    alignSelf: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
