import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PoolScreen from '../screens/PoolScreen';
import PoolDetailScreen from '../screens/PoolDetailScreen';
import CreatePoolScreen from '../screens/CreatePoolScreen';


const Stack = createNativeStackNavigator();

export default function PoolNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PoolMain" component={PoolScreen} />
      <Stack.Screen name="CreatePool" component={CreatePoolScreen} />
    </Stack.Navigator>
  );
}
