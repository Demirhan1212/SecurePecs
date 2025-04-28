import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStack';
import { normalize } from '../utils/normalize';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [userType, setUserType] = useState<'personal' | 'corporate'>('personal');

  const handleUserTypeSelect = (type: 'personal' | 'corporate') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setUserType(type);
  };

  const handleLevelSelect = (selectedLevel: 'beginner' | 'intermediate' | 'advanced') => {
    const levelKey = `${userType}_${selectedLevel}`;
    navigation.navigate('MainDashboard', { level: levelKey });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: normalize(120) }]}>
      <Text style={styles.topLabel}>Home</Text>

      <Text style={styles.title}>
        Welcome to{'\n'}<Text style={styles.bold}>SecurePECS</Text>
      </Text>
      <Text style={styles.description}>
        Learn how to protect yourself and your company from cyber threats.
      </Text>

      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            userType === 'personal' && styles.activeButton,
          ]}
          onPress={() => handleUserTypeSelect('personal')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              userType === 'personal' && styles.activeButtonText,
            ]}
          >
            Personal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            userType === 'corporate' && styles.activeButton,
          ]}
          onPress={() => handleUserTypeSelect('corporate')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              userType === 'corporate' && styles.activeButtonText,
            ]}
          >
            Corporate
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.chooseLabel}>Choose your level</Text>

      <View style={styles.levelList}>
        <TouchableOpacity style={styles.levelItem} onPress={() => handleLevelSelect('beginner')}>
          <View style={styles.checkbox} />
          <View>
            <Text style={styles.levelTitle}>Beginner</Text>
            <Text style={styles.levelDesc}>For those new to cybersecurity</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelItem} onPress={() => handleLevelSelect('intermediate')}>
          <View style={styles.checkbox} />
          <View>
            <Text style={styles.levelTitle}>Intermediate</Text>
            <Text style={styles.levelDesc}>For those with some experience</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelItem} onPress={() => handleLevelSelect('advanced')}>
          <View style={styles.checkbox} />
          <View>
            <Text style={styles.levelTitle}>Advanced</Text>
            <Text style={styles.levelDesc}>For those looking for a challenge</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/home_screen.png')}
        style={styles.bottomImage}
      />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: normalize(24),
    backgroundColor: '#0a0a0a',
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
  toggleButtons: {
    flexDirection: 'row',
    gap: normalize(10),
    marginBottom: normalize(24),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: normalize(12),
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ffcc00',
  },
  toggleButtonText: {
    color: '#ccc',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  activeButtonText: {
    color: '#fff',
  },
  chooseLabel: {
    color: '#fff',
    fontSize: normalize(16),
    marginBottom: normalize(16),
    fontWeight: '600',
  },
  levelList: {
    marginBottom: normalize(30),
    gap: normalize(12),
  },
  levelItem: {
    flexDirection: 'row',
    gap: normalize(12),
    alignItems: 'center',
    padding: normalize(12),
    borderRadius: normalize(10),
    backgroundColor: '#1c1c1e',
  },
  checkbox: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    borderWidth: 2,
    borderColor: '#888',
  },
  levelTitle: {
    fontSize: normalize(16),
    color: '#fff',
    fontWeight: '600',
  },
  levelDesc: {
    fontSize: normalize(13),
    color: '#aaa',
  },
  bottomImage: {
    width: '100%',
    height: normalize(180),
    borderRadius: normalize(12),
    resizeMode: 'cover',
    marginTop: normalize(10),
  },
});
