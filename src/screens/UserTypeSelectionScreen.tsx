import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import BackButton from '../components/BackButton'; // Geri buton bileşeni

const UserTypeSelectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSelection = (userType: 'personal' | 'corporate') => {
    navigation.navigate('LevelSelection', { userType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <BackButton />
      </View>

      <Text style={styles.title}>Select Your User Type</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelection('personal')}>
        <Text style={styles.buttonText}>Personal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelection('corporate')}>
        <Text style={styles.buttonText}>Corporate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserTypeSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    color: '#00f6ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderColor: '#00f6ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
