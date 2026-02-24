import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from "./App/Naviagtion/AuthNavigator";
import RootNavigator from './App/Naviagtion/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { Colors } from './assets/fonts/fonts';
import { AuthProvider, AuthContext } from './App/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();
function AppContent() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.TEXT} />
      </View>
    );
  }

  return userToken ? <RootNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <StatusBar barStyle='dark-content' />
          <AppContent />
        </SafeAreaProvider>
      </AuthProvider>
    </NavigationContainer>
    </QueryClientProvider>
  );
}
