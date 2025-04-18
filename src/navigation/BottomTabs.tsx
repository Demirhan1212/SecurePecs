import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import HomeStack from './HomeStack';
import ProfileScreen from '../screens/ProfileScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const checkAdmin = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(uid).get();
        const userData = userDoc.data();
        if (userData?.isAdmin === true) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, []);

  const getIconForRoute = (routeName: string, focused: boolean) => {
    let source;

    switch (routeName) {
      case 'Home':
        source = require('../assets/home_icon.png');
        break;
      case 'Profile':
        source = require('../assets/profile_icon.png');
        break;
      case 'Feedback':
        source = require('../assets/feedback_icon.png');
        break;
      case 'Admin':
        source = require('../assets/admin_icon.png');
        break;
      default:
        source = require('../assets/home_icon.png');
    }

    return (
      <Image
        source={source}
        style={{
          width: focused ? 34 : 30,
          height: focused ? 34 : 30,
          borderRadius: 17,
          borderWidth: focused ? 2 : 0,
          borderColor: '#ffcc00',
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#ffcc00',
          borderTopWidth: 2,
          height: 80,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#ffcc00',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ focused }) => getIconForRoute(route.name, focused),
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
