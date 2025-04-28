import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MainDashboardScreen from '../screens/MainDashboardScreen';
import LearnScreen from '../screens/modules/Learn/LearnScreen';
import LearnDetailScreen from '../screens/modules/Learn/LearnDetailScreen';
import QuizScreen from '../screens/modules/quiz/QuizScreen';
import QuizDetailScreen from '../screens/modules/quiz/QuizDetailScreen'; 
import TrainingScreen from '../screens/modules/training/TrainingScreen';
import PhishingSimulatorScreen from '../screens/modules/training/PhishingSimulatorScreen';

// import PersonalBasicDashboard from '../screens/personal/BasicDashboard';
// import PersonalIntermediateDashboard from '../screens/personal/IntermediateDashboard';
// import PersonalAdvancedDashboard from '../screens/personal/AdvancedDashboard';
// import CorporateBasicDashboard from '../screens/corporate/BasicDashboard';
// import CorporateIntermediateDashboard from '../screens/corporate/IntermediateDashboard';
// import CorporateAdvancedDashboard from '../screens/corporate/AdvancedDashboard';

export type HomeStackParamList = {
  HomeScreen: undefined;
  MainDashboard: { level: string };

  LearnScreen: { level: string };
  LearnDetailScreen: { id: string; title: string; content: string };
  QuizScreen: { level: string };
  QuizDetailScreen: { level: string };
  TrainingScreen: { level: string };
  PhishingSimulatorScreen: { level: string };

  //  Old versions
  // personal_basic: undefined;
  // personal_intermediate: undefined;
  // personal_advanced: undefined;
  // corporate_basic: undefined;
  // corporate_intermediate: undefined;
  // corporate_advanced: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MainDashboard" component={MainDashboardScreen} />
      <Stack.Screen name="LearnScreen" component={LearnScreen} />
      <Stack.Screen name="LearnDetailScreen" component={LearnDetailScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="QuizDetailScreen" component={QuizDetailScreen} />
      <Stack.Screen name="TrainingScreen" component={TrainingScreen} />
      <Stack.Screen name="PhishingSimulatorScreen" component={PhishingSimulatorScreen} />

      {/* Other screens */}
      {/* <Stack.Screen name="PasswordPuzzleScreen" component={PasswordPuzzleScreen} /> */}

      {/* Old version dashboards) */}

      {/*
      <Stack.Screen name="personal_basic" component={PersonalBasicDashboard} />
      <Stack.Screen name="personal_intermediate" component={PersonalIntermediateDashboard} />
      <Stack.Screen name="personal_advanced" component={PersonalAdvancedDashboard} />
      <Stack.Screen name="corporate_basic" component={CorporateBasicDashboard} />
      <Stack.Screen name="corporate_intermediate" component={CorporateIntermediateDashboard} />
      <Stack.Screen name="corporate_advanced" component={CorporateAdvancedDashboard} />
      */}
    </Stack.Navigator>
  );
};

export default HomeStack;
