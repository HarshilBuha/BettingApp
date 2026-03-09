
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../../assets/fonts/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLogin, useRegister } from '../../api/AuthApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from "../../components/Loader"

export default function SignAuthScreen({ route }) {
  const defaultMode = route?.params?.mode === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState(defaultMode);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const { signIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const isSignIn = mode === 'signin';


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };


  const validateForm = () => {
    const newErrors = {};

    if (isSignIn) {
      const value = formData.email.trim();

      const isPhone = /^\d{10}$/.test(value);
      const isEmail =
        /^(?!\.)(?!.*\.\.)[a-z0-9._%+-]+(?<!\.)@[a-z0-9-]+(\.[a-z]{2,})+$/i.test(
          value
        );

      if (!value) {
        newErrors.email = 'Email or phone is required';
      } else if (!isPhone && !isEmail) {
        newErrors.email = 'Enter a valid email or 10-digit phone number';
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      }
    }
    else {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!/^(?!\.)(?!.*\.\.)[a-z0-9._%+-]+(?<!\.)@[a-z0-9-]+(\.[a-z]{2,})+$/
        .test(formData.email)) {
        newErrors.email = 'Email is not valid';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = () => {
    if (!validateForm()) return;
    const isPhoneNumber = (value) => /^\d{10}$/.test(value);

    if (isSignIn) {
      const identifier = formData.email.trim();

      const payload = isPhoneNumber(identifier)
        ? { phone: identifier, password: formData.password }
        : { email: identifier, password: formData.password };

      loginMutation.mutate(payload, {
        onSuccess: async (data) => {
          const token = data?.token;
          const user = data?.user;

          if (!token || !user) {
            Alert.alert('Login Failed', 'Invalid response');
            return;
          }

          await signIn(token, user);
        },
        onError: (error) => {
          Alert.alert(
            'Login Failed',
            error.message || 'Something went wrong'
          );
        },
      });

    } else {
      registerMutation.mutate(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          onSuccess: async (data) => {
            console.log('REGISTER SUCCESS', data);

            const token = data?.token;
            const user = data?.user;

            if (!token || !user) {
              Alert.alert('Registration Failed', 'Invalid response');
              return;
            }

            await signIn(token, user); 
          },
          onError: (error) => {
            Alert.alert(
              'Registration Failed',
              error.message || 'Something went wrong'
            );
          },
        }
      );
    }
  };



  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setErrors({});
    setShowPassword(false);
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      {isLoading && <Loader visible={isLoading} />}
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.outerCurve}>
            <View style={styles.card}>
              <Text style={styles.title}>
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Text>
              {!isSignIn && (
                <Text style={styles.subtitle}>
                  Create an account to continue!
                </Text>
              )}


              {/* Tab Switcher */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  onPress={() => switchMode('signin')}
                  style={[styles.tab, isSignIn && styles.activeTab]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isSignIn && styles.activeTabText,
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={() => switchMode('signup')}
                  style={[styles.tab, !isSignIn && styles.activeTab]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      !isSignIn && styles.activeTabText,
                    ]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>


              {/* Form Fields */}
              <View style={styles.formContainer}>
                {/* Name Field - Only for Sign Up */}
                {!isSignIn && (
                  <View style={styles.inputGroup}>
                    <TextInput
                      placeholder="Enter Name"
                      placeholderTextColor={Colors.SUBTEXT}
                      style={[
                        styles.input, ,
                      ]}
                      value={formData.name}
                      onChangeText={(value) =>
                        handleInputChange('name', value)
                      }
                    />
                    {errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>
                )}


                {/* Email/Phone Field */}
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder={
                      isSignIn ? 'Enter Email or Phone No.' : 'Enter Email'
                    }
                    placeholderTextColor={Colors.SUBTEXT}
                    style={[
                      styles.input,
                    ]}
                    keyboardType={
                      isSignIn ? 'default' : 'email-address'
                    }
                    value={formData.email}
                    onChangeText={(value) =>
                      handleInputChange('email', value)
                    }
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>


                {/* Phone Field - Only for Sign Up */}
                {!isSignIn && (
                  <View style={styles.inputGroup}>
                    <TextInput
                      placeholder="Enter Phone No."
                      placeholderTextColor={Colors.SUBTEXT}
                      style={[
                        styles.input, ,
                      ]}
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(value) =>
                        handleInputChange('phone', value)
                      }
                      maxLength={10}
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.phone}</Text>
                    )}
                  </View>
                )}


                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Enter Password"
                      placeholderTextColor={Colors.SUBTEXT}
                      secureTextEntry={!showPassword}
                      style={[
                        styles.input,
                        styles.passwordInput,
                      ]}
                      value={formData.password}
                      onChangeText={(value) =>
                        handleInputChange('password', value)
                      }
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Icon
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.TEXT}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>


                {/* Forgot Password - Only for Sign In */}
                {isSignIn && (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Forgot')}>
                    <Text style={styles.forgotPassword}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                )}


                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.buttonWrapper}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={Colors.GRADIENT}  
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {isSignIn ? 'Sign In' : 'Register'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>


                {/* Switch Mode Text */}
                <Text style={styles.switchText}>
                  {isSignIn
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <Text
                    style={styles.switchLink}
                    onPress={() =>
                      switchMode(isSignIn ? 'signup' : 'signin')
                    }
                  >
                    {isSignIn ? 'Sign Up' : 'Log In'}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  outerCurve: {
    backgroundColor: Colors.DARKGREY,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 12,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: Colors.GREY,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.DARKGREY,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.DARKGREY,
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    alignSelf: 'center',
    width: '70%',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.GREY,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.GREY,
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.TEXT,
    fontFamily: 'Inter-Bold'
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 14,
    color: Colors.TEXT,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  inputError: {
    borderColor: Colors.ERROR,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  errorText: {
    color: Colors.ERROR,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    textAlign: 'right',
    color: Colors.TEXT,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginBottom: 24,
    marginTop: 8,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.GREY,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginTop: 16,
  },
  switchLink: {
    color: Colors.TEXT,
    textDecorationLine: 'underline',
  },
});