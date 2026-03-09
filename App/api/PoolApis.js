import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePool_Api, GetAllUsers_Api, GetCategories_Api, GetPools_Api, Prediction_Api, GetPoolsNotificationInvite_Api } from './commonApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const createPoolApi = async (payload) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(CreatePool_Api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to send Code");
    }
    return data;
};

const getPoolsApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetPools_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get pools');
    }
    return result.data;
};


const getUsersApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetAllUsers_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get users');
    }
    return result;
};

const getCategoriesApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetCategories_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get categories');
    }
    return result.categories;
};


const createPredictionApi = async ({ id, prediction }) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(`${Prediction_Api}/${id}/prediction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prediction }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create code");
    }
    return data;
};

const declareResultApi = async ({ id, correctPrediction }) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(`${Prediction_Api}/${id}/declare-result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ correctPrediction }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create code");
    }
    return data;
};

const poolReopenApi = async ({ id }) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(`${Prediction_Api}/${id}/reopen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create code");
    }
    return data;
};

const getInvitedPools = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetPoolsNotificationInvite_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get pools invites');
    }
    return result.data;
};

const updatePoolOptionsApi = async ({ poolId, options }) => {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
        Alert.alert("Token not found");
    }

    const response = await fetch(`${Prediction_Api}/${poolId}/options/add`, {
        method: 'PATCH', 
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ options }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to update pool options');
    }

    return result;
};

export const useUpdatePoolOptions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePoolOptionsApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pools'] });
        },
    });
};


export const useCreatePool = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPoolApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pools'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });
}

export const usePrediction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPredictionApi,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pools'] })
    });
}

export const usePoolReopen = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: poolReopenApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pools'] });
            queryClient.invalidateQueries({ queryKey: ['poolResults'] });
            queryClient.invalidateQueries({ queryKey: ['poolStatistics'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });
}

export const useDeclareResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: declareResultApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pools'] });
            queryClient.invalidateQueries({ queryKey: ['poolResults'] });
            queryClient.invalidateQueries({ queryKey: ['poolStatistics'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }

    });
}

export const useGetPools = () => useQuery({ queryKey: ['pools'], queryFn: getPoolsApi, });

export const useGetInvitedPools = () => useQuery({ queryKey: ['invitedPools'], queryFn: getInvitedPools, })

export const useGetUsers = () => useQuery({ queryKey: ['users'], queryFn: getUsersApi, });

export const useGetCategories = () => useQuery({ queryKey: ['categories'], queryFn: getCategoriesApi, });