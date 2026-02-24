import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInRegisterScreen from '../screens/Auth/SignInRegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import OnBoardingScreen from '../screens/Auth/OnBoardingScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboard" component={OnBoardingScreen} />
      <Stack.Screen name="Auth" component={SignInRegisterScreen} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name='OTPVerification' component={OTPVerificationScreen}/>
    </Stack.Navigator>
  );
}
