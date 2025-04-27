import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// SCREENS
import AuthScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import BottomTabs from './BottomTabs';

// Admin screns
import FeedbackManagerScreen from '../screens/admin/FeedbackManagerScreen';
import ContentManagerScreen from '../screens/admin/ContentManagerScreen';
import QuizManagerScreen from '../screens/admin/QuizManagerScreen';
import QuizEditorScreen from '../screens/admin/QuizEditorScreen';
import TrainingManagerScreen from '../screens/admin/TrainingManagerScreen';
import PhishingSimulatorManager from '../screens/admin/PhishingSimulatorManager';
import PhishingManagerScreen from '../screens/admin/PhishingManagerScreen';



export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  UserTypeSelection: undefined;
  LevelSelection: { userType: 'personal' | 'corporate' };

  BottomTabs: undefined;

  // Admins
  FeedbackManager: undefined;
  ContentManager: undefined;
  QuizManager: undefined;
  QuizEditor: undefined;
  trainingManager: undefined; 
  PhishingSimulatorManager: undefined;
  PhishingManager: undefined;

  // Dashboards
  personal_beginner: undefined;
  personal_intermediate: undefined;
  personal_advanced: undefined;
  corporate_beginner: undefined;
  corporate_intermediate: undefined;
  corporate_advanced: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        

        {/* 🔧 Admin */}
        <Stack.Screen name="FeedbackManager" component={FeedbackManagerScreen} />
        <Stack.Screen name="ContentManager" component={ContentManagerScreen} />
        <Stack.Screen name="QuizManager" component={QuizManagerScreen} />
        <Stack.Screen name="QuizEditor" component={QuizEditorScreen} />
        <Stack.Screen name="TrainingManager" component={TrainingManagerScreen} />
        <Stack.Screen name="PhishingSimulatorManager" component={PhishingSimulatorManager} />
        <Stack.Screen name="PhishingManager" component={PhishingManagerScreen} />

        {/* User type selec */}


        {/* Dashboards */}
        <Stack.Screen name="personal_beginner" component={require('../screens/personal/BasicDashboard').default} />
        <Stack.Screen name="personal_intermediate" component={require('../screens/personal/IntermediateDashboard').default} />
        <Stack.Screen name="personal_advanced" component={require('../screens/personal/AdvancedDashboard').default} />
        <Stack.Screen name="corporate_beginner" component={require('../screens/corporate/BasicDashboard').default} />
        <Stack.Screen name="corporate_intermediate" component={require('../screens/corporate/IntermediateDashboard').default} />
        <Stack.Screen name="corporate_advanced" component={require('../screens/corporate/AdvancedDashboard').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
