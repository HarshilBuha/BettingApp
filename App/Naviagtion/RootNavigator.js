import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import NotificationScreen from "../screens/NotificationScreen"
import ResultScreen from "../screens/ResultScreen"
import StatisticScreen from "../screens/StatisticScreen"

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Results" component={ResultScreen} />
      <Stack.Screen name="Statistics" component={StatisticScreen} />
    </Stack.Navigator>
  );
}
