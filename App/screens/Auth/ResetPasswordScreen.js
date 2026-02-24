import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Colors } from '../../../assets/fonts/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Images } from '../../../assets/Images';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientButton from '../../components/GradientButton'
import { useResetPassword } from '../../api/AuthApi';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ResetPasswordScreen({ route }) {
  const email = route.params?.email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation()
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const resetPassword = useResetPassword()
  const loading = resetPassword.isPending
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
  const validateForm = () => {
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleResetPassword = () => {
    if (validateForm()) {
      resetPassword.mutate(
        {
          email: email,
          newPassword: newPassword,
        },
        {
          onSuccess: () => {
            ToastAndroid.showWithGravity(
              "Password Changed Successfully",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            navigation.navigate(token ? "ProfileMain":"Auth")
          },
          onError: (error) => {
            Alert.alert(
              'OTP Verification Failed',
              error.message || 'Something went wrong'
            );
          },
        }
      );
    }
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
        <Text style={styles.title}>Reset password?</Text>
        <Text style={styles.subtitle}>
          Please type something you'll remember
        </Text>

        {/* New Password Field */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="New Password"
              placeholderTextColor={Colors.SUBTEXT}
              secureTextEntry={!showNewPassword}
              style={[
                styles.input,
                errors.newPassword && styles.inputError,
              ]}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: '' }));
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
              activeOpacity={0.7}
            >
              <Icon
                name={showNewPassword ? 'eye' : 'eye-off'}
                size={20}
                color={Colors.SUBTEXT}
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor={Colors.SUBTEXT}
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color={Colors.SUBTEXT}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <GradientButton
          title="Reset Password"
          onPress={handleResetPassword}
        />

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20
  },
  backBtn: {
    padding: 6
  },
  logoSmall: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.DARKGREY,
    marginBottom: 30,
    fontFamily: 'Inter-Regular',
  },
  inputGroup: {
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    fontSize: 14,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 10,
  },
  errorText: {
    color: Colors.ERROR,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    marginLeft: 4,
  },
});