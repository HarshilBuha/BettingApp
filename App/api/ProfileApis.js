import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Platform } from "react-native";
import { GetPoolResults_Api, GetPoolStatistics_Api, GetProfile_Api, UpdateProfile_Api } from './commonApi';
import axios from "axios";

const getPoolResultsApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetPoolResults_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get pools results');
    }
    return result.data;
};

const getPoolStatisticsApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetPoolStatistics_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get pools statistics');
    }
    return result.data;
};

const getProfileApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetProfile_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get profile data');
    }
    return result.user;
};


const updateProfile = async (image) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token not found");

  const formData = new FormData();

  formData.append("profile", {
    uri: image.uri,
    type: image.type,
    name: image.name || `profile_${Date.now()}.jpg`,
  });

  const response = await axios.put(
    UpdateProfile_Api,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type manually
      },
    }
  );

  return response.data;
};


/* -------------------- REACT QUERY HOOKS -------------------- */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      Alert.alert(
        "Profile update failed",
        error?.response?.data?.message || error.message
      );
    },
  });
};

export const useGetPoolResults = () => useQuery({ queryKey: ['poolResults'], queryFn: getPoolResultsApi, });
export const useGetPoolStatistics = () => useQuery({ queryKey: ['poolStatistics'], queryFn: getPoolStatisticsApi, });
export const useGetProfile = () => useQuery({ queryKey: ['profile'], queryFn: getProfileApi, });