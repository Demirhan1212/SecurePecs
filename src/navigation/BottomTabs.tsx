import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import HomeStack from './HomeStack';
import ProfileScreen from '../screens/ProfileScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import { normalize } from '../utils/normalize';

const Tab = createBottomTabNavigator();

const getAvatarImage = (key: string) => {
  switch (key) {
    case 'ppicture1': return require('../assets/ppicture1.png');
    case 'ppicture2': return require('../assets/ppicture2.png');
    case 'ppicture3': return require('../assets/ppicture3.png');
    case 'ppicture4': return require('../assets/ppicture4.png');
    case 'ppicture5': return require('../assets/ppicture5.png');
    case 'ppicture6': return require('../assets/ppicture6.png');
    case 'ppicture7': return require('../assets/ppicture7.png');
    case 'ppicture8': return require('../assets/ppicture8.png');
    case 'ppicture9': return require('../assets/ppicture9.png');
    case 'ppicture10': return require('../assets/ppicture10.png');
    default: return require('../assets/profile_icon.png');
  }
};

const BottomTabs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarKey, setAvatarKey] = useState<string>('');

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const doc = await firestore().collection('users').doc(uid).get();
        const data = doc.data();
        if (data?.isAdmin) setIsAdmin(true);
        if (data?.avatar) setAvatarKey(data.avatar);
      } catch (err) {
        console.log('Error loading user:', err);
      }
    };

    fetchUser();
  }, []);

  const renderIconWithLabel = (routeName: string, focused: boolean, color: string) => {
    let iconSource;
    let label = routeName;

    switch (routeName) {
      case 'Home':
        iconSource = require('../assets/home_icon.png');
        label = 'Home';
        break;
      case 'Profile':
        iconSource = getAvatarImage(avatarKey);
        label = 'Profile';
        break;
      case 'Feedback':
        iconSource = require('../assets/feedback_icon.png');
        label = 'Feedback';
        break;
      case 'Admin':
        iconSource = require('../assets/admin_icon.png');
        label = 'Admin';
        break;
      default:
        iconSource = require('../assets/home_icon.png');
    }

    return (
      <View style={styles.tabItem}>
        <Image
          source={iconSource}
          style={[
            styles.icon,
            routeName !== 'Profile' && { tintColor: color },
          ]}
        />
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) =>
          renderIconWithLabel(route.name, focused, color),
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#888888',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminScreen} />}
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1e1e1e',
    borderTopWidth: 0,
    height: normalize(80),
    paddingBottom: Platform.OS === 'ios' ? normalize(20) : normalize(12),
    paddingTop: normalize(6),
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    position: 'absolute',
    bottom: 0,
  },
  tabItem: {
    width: normalize(64),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: normalize(26),
    height: normalize(26),
    borderRadius: normalize(13),
    resizeMode: 'cover',
    marginBottom: normalize(2),
  },
  label: {
    fontSize: normalize(11),
    fontWeight: '500',
    lineHeight: normalize(13),
    textAlign: 'center',
  },
});
