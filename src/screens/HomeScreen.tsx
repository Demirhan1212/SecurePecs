import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStack';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [userType, setUserType] = useState<'personal' | 'corporate' | null>(null);
  const [levelVisible, setLevelVisible] = useState(false);

  const handleUserTypeSelect = (type: 'personal' | 'corporate') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setUserType(type);
    setLevelVisible(true);
  };

  const handleLevelSelect = (level: 'basic' | 'intermediate' | 'advanced') => {
    const screenName = `${userType}_${level}` as keyof HomeStackParamList;
    navigation.navigate(screenName);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to CyberSecApp 🚀</Text>
      <Text style={styles.subheading}>Please select your user type</Text>

      <View style={styles.typeButtonRow}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => handleUserTypeSelect('personal')}
        >
          <Image
            source={require('../assets/personal.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => handleUserTypeSelect('corporate')}
        >
          <Image
            source={require('../assets/corporate.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
      </View>

      {levelVisible && (
        <View style={styles.levelSection}>
          <Text style={styles.subheading}>Now choose your level</Text>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => handleLevelSelect('basic')}
          >
            <Image
              source={require('../assets/basic.png')}
              style={styles.imageIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => handleLevelSelect('intermediate')}
          >
            <Image
              source={require('../assets/intermediate.png')}
              style={styles.imageIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => handleLevelSelect('advanced')}
          >
            <Image
              source={require('../assets/advanced.png')}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    color: '#ffcc00',
    fontWeight: '700',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeButtonRow: {
    flexDirection: 'row',
    gap: 20, // 👈 butonlar daha yakın
    marginBottom: 24,
  },
  imageButton: {
    padding: 4,
    alignItems: 'center',
    width: 140,
  },
  imageIcon: {
    width: 200, // 👈 daha büyük ikon
    height: 160,
    resizeMode: 'contain',
  },
  levelSection: {
    width: '100%',
    alignItems: 'center',
    gap: 0, // 👈 seviye arası daha yakın
  },
});

