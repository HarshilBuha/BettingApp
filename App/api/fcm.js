import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { FCM_Api } from "./commonApi";

/**
 * Gets, saves, or updates the FCM token and stores it in AsyncStorage.
 * Returns the token as a string.
 */
export async function getFCMToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        await messaging().registerDeviceForRemoteMessages();
        fcmToken = await messaging().getToken();
        if (fcmToken) {
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
    return fcmToken;
}

export async function sendFCMTokenToBackend() {
    const fcmtoken = await getFCMToken();
    console.log(fcmtoken, "fcm");

    if (!fcmtoken) return;

    const token = await AsyncStorage.getItem("userToken");

    // Replace with your actual API endpoint
    const res = await fetch(FCM_Api, {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            fcmtoken,
        }),
    });
    console.log("send token", res);

    if (!res.ok) {
        // optionally log/report error
        const errText = await res.text();
        throw new Error("Failed to register FCM token: " + errText);
    }

    return true;
}


/**
 * Force renewal and update FCM token in AsyncStorage.
 * Useful when the token changes.
 */
export async function refreshFCMToken() {
    await messaging().registerDeviceForRemoteMessages();
    const newToken = await messaging().getToken();
    if (newToken) {
        await AsyncStorage.setItem('fcmToken', newToken);
    }
    return newToken;
}

/**
 * Allows listening for FCM token refresh events.
 * Usage: const unsubscribe = onFCMTokenChange(cb)
 */
export function onFCMTokenChange(callback) {
    return messaging().onTokenRefresh(async (token) => {
        await AsyncStorage.setItem('fcmToken', token);
        callback(token);
    });
}
