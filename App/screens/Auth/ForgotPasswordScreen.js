import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../../../assets/fonts/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Images } from '../../../assets/Images';
import GradientButton from '../../components/GradientButton'
import { useForgotPasswordOTP } from '../../api/AuthApi';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPasswordScreen({ }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        setToken(storedToken);
      } catch (error) {
        console.log('Error getting token:', error);
      }
    };

    getToken();
  }, []);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation()
  const forgotPasswordOTP = useForgotPasswordOTP()
  const loading = forgotPasswordOTP.isPending
  const handleSendCode = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    forgotPasswordOTP.mutate(
      {
        email: email,
      },
      {
        onSuccess: async () => {
          navigation.navigate('OTPVerification', { email });
        },
        onError: (error) => {
          Alert.alert(
            'Login Failed',
            error.message || 'Something went wrong'
          );
        },
      }
    );

  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={Images.Back} resizeMode='contain' style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Image source={Images.Logo} style={styles.logoSmall} />
      </View>
      <Loader visible={loading} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Don’t worry! It happens. Please enter the email or phone associated with your account.
        </Text>

        <TextInput
          placeholder="Email address"
          placeholderTextColor={Colors.SUBTEXT}
          style={[styles.input, error && styles.inputError]}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError('');
          }}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <GradientButton
          title="Send Code"
          onPress={handleSendCode}
        />
        {token ? null :
          <Text style={styles.bottomText}>
            Remember password?{' '}
            <Text style={styles.bottomLink} onPress={() => navigation.goBack()}>
              Log In
            </Text>
          </Text>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20
  },
  backBtn: { padding: 6 },
  logoSmall: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: Colors.DARKGREY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TEXT,
    marginBottom: 30,
    fontFamily: 'Inter-Regular',
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
  },
  bottomText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.SUBTEXT,
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomLink: {
    color: Colors.TEXT,
    fontFamily: 'Inter-Bold',
  },
});
