import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { normalize } from '../../../utils/normalize';
import BackButton from '../../../components/BackButton';

const LearnScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { level } = route.params as { level: string };

  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('modules')
      .where('type', '==', 'learn')
      .where('level', '==', level)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModules(data);
      });

    return () => unsubscribe();
  }, [level]);

  const formattedLevel = level.replace('_', ' - ').replace(/^\w/, c => c.toUpperCase());

  const openModule = (module: any) => {
    navigation.navigate('LearnDetailScreen' as never, {
      id: module.id,
      title: module.title,
      content: module.content,
    } as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />

      <View style={{ paddingTop: normalize(80) }}>
        <Text style={styles.topLabel}>Learn</Text>

        <Text style={styles.title}>
          Learning Modules{'\n'}
          <Text style={styles.bold}>{formattedLevel}</Text>
        </Text>

        <Text style={styles.description}>
          Explore level-specific guides designed to improve your knowledge.
        </Text>

        {modules.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => openModule(item)}>
            <View style={styles.cardLeft}>
              <Image
                source={require('../../../assets/learn_icon.png')}
                style={styles.cardIcon}
              />
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardText}>{item.title}</Text>
              <Text style={styles.cardSubtext}>Tap to explore this topic</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(24),
    backgroundColor: '#0a0a0a',
    flexGrow: 1,
  },
  topLabel: {
    color: '#888',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '400',
    color: '#fff',
    textAlign: 'left',
    marginBottom: normalize(10),
  },
  bold: {
    fontWeight: '700',
  },
  description: {
    color: '#aaa',
    fontSize: normalize(14),
    marginBottom: normalize(20),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: normalize(12),
  },
  cardIcon: {
    width: normalize(36),
    height: normalize(36),
    resizeMode: 'contain',
  },
  cardRight: {
    flex: 1,
  },
  cardText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtext: {
    color: '#aaa',
    fontSize: normalize(13),
  },
});
