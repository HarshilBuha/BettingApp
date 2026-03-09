import { useMutation } from '@tanstack/react-query';
import { DeleteAccount_Api, ForgotPasswordOTP_Api, ForgotPasswordOTPVerify_Api, Login_Api, Register_Api, ResetPassword_Api } from './commonApi';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Send OTP (Login)
const loginApi = async (payload) => {
  try {
    const response = await fetch(`${Login_Api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeout: 15000, 
    });
    
    if (!response) {
      throw new Error("Network request failed - no response");
    }
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw new Error(error.message || "Network request failed");
  }
};

// Send OTP (Signup)
const registerApi = async ({ name, email, phone, password }) => {
  try {
    const response = await fetch(`${Register_Api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
      timeout: 15000,
    });

    if (!response) {
      throw new Error("Network request failed - no response");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Register failed: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Register API Error:', error);
    throw new Error(error.message || "Network request failed");
  }
};

const resetPasswordApi = async ({ email, newPassword }) => {
  try {
    const response = await fetch(`${ResetPassword_Api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
      timeout: 15000,
    });

    if (!response) {
      throw new Error("Network request failed - no response");
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Failed: ${response.status}`);
    return data;
  } catch (error) {
    console.error('Reset Password API Error:', error);
    throw error;
  }
};

const forgotPasswordOTPApi = async ({ email }) => {
  try {
    const response = await fetch(ForgotPasswordOTP_Api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      timeout: 15000,
    });

    if (!response) {
      throw new Error("Network request failed - no response");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Forgot Password OTP API Error:', error);
    throw error;
  }
};

const forgotPasswordOTPVerifyApi = async ({ email, otp }) => {
  try {
    const response = await fetch(ForgotPasswordOTPVerify_Api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      timeout: 15000,
    });

    if (!response) {
      throw new Error("Network request failed - no response");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('OTP Verify API Error:', error);
    throw error;
  }
};

const deleteAccountApi = async ({ }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(DeleteAccount_Api, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    });

    if (!response) {
      throw new Error("Network request failed - no response");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Delete Account API Error:', error);
    throw error;
  }
};

export const useLogin = () => useMutation({ mutationFn: loginApi });

export const useRegister = () => useMutation({ mutationFn: registerApi });

export const useResetPassword = () => useMutation({ mutationFn: resetPasswordApi });

export const useForgotPasswordOTP = () => useMutation({ mutationFn: forgotPasswordOTPApi });

export const useForgotPasswordOTPVerify = () => useMutation({ mutationFn: forgotPasswordOTPVerifyApi });

export const useDeleteAccount = () => useMutation({ mutationFn: deleteAccountApi })