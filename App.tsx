import React, { useContext, useEffect } from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {
  StatusBar,
  View,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

import AuthNavigator from "./App/Naviagtion/AuthNavigator";
import RootNavigator from './App/Naviagtion/RootNavigator';
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

  useEffect(() => {

    const requestUserPermission = async () => {
      try {
        // Android 13+ runtime permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ Notification permission denied (Android 13+)');
            return false;
          }
        }

        // iOS & older Android permission
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('❌ FCM permission not granted');
          return false;
        }

        console.log('✅ Notification permission granted');
        return true;

      } catch (error) {
        console.log('Permission error:', error);
        return false;
      }
    };

    const initFCM = async () => {
      try {
        const hasPermission = await requestUserPermission();
        if (!hasPermission) return;

        await messaging().registerDeviceForRemoteMessages();

        // Create Android notification channel
        await notifee.createChannel({
          id: 'default_sound',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound: 'notification_sound',
        });

        // Get FCM token
        const token = await messaging().getToken();
        console.log('🔥 FCM Token:', token);


        // Foreground message listener
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('📩 Foreground message:', remoteMessage);

          const imageUrl =
            remoteMessage.notification?.android?.imageUrl ||
            remoteMessage.notification?.image ||
            remoteMessage.data?.image;

          await notifee.displayNotification({
            title: remoteMessage.notification?.title || 'Notification',
            body: remoteMessage.notification?.body || '',
            android: {
              channelId: 'default_sound',
              smallIcon: 'ic_stat_notification',
              style: imageUrl
                ? {
                  type: AndroidStyle.BIGPICTURE,
                  picture: imageUrl,
                }
                : undefined,
              pressAction: {
                id: 'default',
              },
            },
          });
        });

        // Background message handler
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('📩 Background message:', remoteMessage);
          return Promise.resolve();
        });
        return unsubscribe;

      } catch (error) {
        console.log('FCM Init Error:', error);
      }
    };

    const unsubscribePromise = initFCM();

    return () => {
      if (unsubscribePromise) {
        unsubscribePromise.then(unsub => unsub && unsub());
      }
    };

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppContent />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}