import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

const DashboardScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Dashboard'>>();
  const { userType, level } = route.params;

  const renderContent = () => {
    if (userType === 'bireysel' && level === 'temel') {
      return (
        <>
          <Text style={styles.heading}>👤 Bireysel - Temel Seviye</Text>
          <Text style={styles.module}>🧠 Siber Güvenlik Giriş</Text>
          <Text style={styles.module}>🎯 Şifre Güvenliği Oyunu</Text>
          <Text style={styles.module}>📚 Eğitim Blogu: Bilinçli Kullanıcı Olmak</Text>
        </>
      );
    } else if (userType === 'kurumsal' && level === 'orta') {
      return (
        <>
          <Text style={styles.heading}>🏢 Kurumsal - Orta Seviye</Text>
          <Text style={styles.module}>🔐 Ağ Güvenliği Modülü</Text>
          <Text style={styles.module}>🕵️‍♂️ Sosyal Mühendislik Simülasyonu</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.heading}>
            🚀 {userType === 'bireysel' ? 'Bireysel' : 'Kurumsal'} - {level.charAt(0).toUpperCase() + level.slice(1)} Seviye
          </Text>
          <Text style={styles.module}>📦 Standart Modül 1</Text>
          <Text style={styles.module}>📦 Standart Modül 2</Text>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    color: '#00f6ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  module: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
});
