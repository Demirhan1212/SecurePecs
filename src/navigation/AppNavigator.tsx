import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ekranlar
import AuthScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import UserTypeSelectionScreen from '../screens/UserTypeSelectionScreen'; // opsiyonel
import LevelSelectionScreen from '../screens/LevelSelectionScreen';     // opsiyonel

// Alt bar yapısı
import BottomTabs from './BottomTabs';

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  UserTypeSelection: undefined;
  LevelSelection: { userType: 'personal' | 'corporate' };

  BottomTabs: undefined;

  // Dashboard yönlendirmeleri HomeScreen içinden yapıldığı için
  // buraya dashboardları eklemek artık opsiyonel hale geldi
  personal_basic: undefined;
  personal_intermediate: undefined;
  personal_advanced: undefined;
  corporate_basic: undefined;
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
        <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
        <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />

        {/* 🔻 Giriş sonrası alt barlı ana uygulama alanı */}
        <Stack.Screen name="BottomTabs" component={BottomTabs} />

        {/* (Opsiyonel) Dashboardlar hâlâ yönlendirme için lazım olabilir */}
        <Stack.Screen name="personal_basic" component={require('../screens/personal/BasicDashboard').default} />
        <Stack.Screen name="personal_intermediate" component={require('../screens/personal/IntermediateDashboard').default} />
        <Stack.Screen name="personal_advanced" component={require('../screens/personal/AdvancedDashboard').default} />
        <Stack.Screen name="corporate_basic" component={require('../screens/corporate/BasicDashboard').default} />
        <Stack.Screen name="corporate_intermediate" component={require('../screens/corporate/IntermediateDashboard').default} />
        <Stack.Screen name="corporate_advanced" component={require('../screens/corporate/AdvancedDashboard').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
