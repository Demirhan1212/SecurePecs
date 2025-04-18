import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton';

type LevelSelectionRouteProp = RouteProp<RootStackParamList, 'LevelSelection'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LevelSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelSelectionRouteProp>();
  const { userType } = route.params;

  const screenMap: Record<
    'personal' | 'corporate',
    Record<'basic' | 'intermediate' | 'advanced', keyof RootStackParamList>
  > = {
    personal: {
      basic: 'personal_basic',
      intermediate: 'personal_intermediate',
      advanced: 'personal_advanced',
    },
    corporate: {
      basic: 'corporate_basic',
      intermediate: 'corporate_intermediate',
      advanced: 'corporate_advanced',
    },
  };

  const handleLevelSelection = (level: 'basic' | 'intermediate' | 'advanced') => {
    const screenName = screenMap[userType][level];
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <BackButton />
      </View>

      <Text style={styles.title}>Siber Guvenlik Egitimine nereden baslamak istersin?</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleLevelSelection('basic')}>
        <Text style={styles.buttonText}>Basic</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleLevelSelection('intermediate')}>
        <Text style={styles.buttonText}>Intermediate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleLevelSelection('advanced')}>
        <Text style={styles.buttonText}>Advanced</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LevelSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 20,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: '#00f6ff',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderColor: '#00f6ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
