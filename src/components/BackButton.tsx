import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../utils/normalize';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/back_icon.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(50) : normalize(30),
    left: normalize(20),
    zIndex: 100, 
  },
  backButton: {
    backgroundColor: '#1c1c1e',
    borderRadius: normalize(20),
    width: normalize(42),
    height: normalize(42),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: normalize(18),
    height: normalize(18),
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});
