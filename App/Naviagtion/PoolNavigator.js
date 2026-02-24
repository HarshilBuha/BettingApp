import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PoolScreen from '../screens/PoolScreen';
import PoolDetailScreen from '../screens/PoolDetailScreen';
import CreatePoolScreen from '../screens/CreatePoolScreen';
import SuggestCustomOptionsScreen from '../screens/SuggestCustomOptionsScreen';

const Stack = createNativeStackNavigator();

export default function PoolNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PoolMain" component={PoolScreen} />
      <Stack.Screen name="PoolDetail" component={PoolDetailScreen} />
      <Stack.Screen name="CreatePool" component={CreatePoolScreen} />
      <Stack.Screen
        name="SuggestCustomOptions"
        component={SuggestCustomOptionsScreen}
      />
    </Stack.Navigator>
  );
}
