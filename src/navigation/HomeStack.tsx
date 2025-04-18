import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

import PersonalBasicDashboard from '../screens/personal/BasicDashboard';
import PersonalIntermediateDashboard from '../screens/personal/IntermediateDashboard';
import PersonalAdvancedDashboard from '../screens/personal/AdvancedDashboard';

import CorporateBasicDashboard from '../screens/corporate/BasicDashboard';
import CorporateIntermediateDashboard from '../screens/corporate/IntermediateDashboard';
import CorporateAdvancedDashboard from '../screens/corporate/AdvancedDashboard';

export type HomeStackParamList = {
  HomeScreen: undefined;
  personal_basic: undefined;
  personal_intermediate: undefined;
  personal_advanced: undefined;
  corporate_basic: undefined;
  corporate_intermediate: undefined;
  corporate_advanced: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      {/* Personal Dashboards */}
      <Stack.Screen name="personal_basic" component={PersonalBasicDashboard} />
      <Stack.Screen name="personal_intermediate" component={PersonalIntermediateDashboard} />
      <Stack.Screen name="personal_advanced" component={PersonalAdvancedDashboard} />

      {/* Corporate Dashboards */}
      <Stack.Screen name="corporate_basic" component={CorporateBasicDashboard} />
      <Stack.Screen name="corporate_intermediate" component={CorporateIntermediateDashboard} />
      <Stack.Screen name="corporate_advanced" component={CorporateAdvancedDashboard} />
    </Stack.Navigator>
  );
};

export default HomeStack;
