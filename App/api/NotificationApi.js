import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { GetPoolsNotification_Api, NotificationRespond_Api } from './commonApi';

const getPoolsNotificationApi = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(GetPoolsNotification_Api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get notifications');
    }
    return result.notifications;
};


const notificationRespondApi = async ({ action,id }) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
        Alert.alert("Token not found")
    }
    const response = await fetch(`${NotificationRespond_Api}/${id}/respond`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to send Response");
    }
    return data;
}

export const usePoolsNotification = () => useQuery({ queryKey: ['poolsNotification'], queryFn: getPoolsNotificationApi });

export const useNotificationRespond = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationRespondApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pools'] });
            queryClient.invalidateQueries({ queryKey: ['invitedPools'] });
            queryClient.invalidateQueries({ queryKey: ['poolsNotification'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });
}