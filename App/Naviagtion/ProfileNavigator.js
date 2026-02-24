import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name='OTPVerification' component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}
