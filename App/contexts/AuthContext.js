import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (token) setUserToken(token);
        if (storedUser) setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const signIn = async (token, user) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserToken(token);
      setUserData(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUserToken(null);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userData,   // ✅ NOW PROVIDED
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
