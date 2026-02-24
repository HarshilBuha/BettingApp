import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import PoolNavigator from './PoolNavigator';
import ProfileNavigator from './ProfileNavigator';

import CustomTabBar from '../Naviagtion/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="PoolStack" component={PoolNavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
