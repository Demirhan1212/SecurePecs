import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';

const LearnDetailScreen = () => {
  const route = useRoute();
  const { title, content } = route.params as {
    title: string;
    content: string;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />

      {/* İçerik alanı */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.content}>{content}</Text>
      </View>
    </ScrollView>
  );
};

export default LearnDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(40),
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: normalize(80), // BackButton için boşluk
    marginBottom: normalize(24),
  },
  title: {
    fontSize: normalize(28),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
  },
  contentWrapper: {
    padding: normalize(16),
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(12),
  },
  content: {
    color: '#e0e0e0',
    fontSize: normalize(15),
    lineHeight: normalize(26),
    textAlign: 'left',
  },
});
