import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/fonts/fonts';
import Header from '../components/Header';
import { useNotificationRespond, usePoolsNotification } from '../api/NotificationApi';
import TimeAgo from '../components/TimeAgo';
import Loader from '../components/Loader';

export default function NotificationScreen() {
    const { data: notifications = [], isLoading, error, refetch } = usePoolsNotification();
    console.log(notifications);
    const NotificationRespond = useNotificationRespond()
    const loading=NotificationRespond.isPending || isLoading

    const handleSubmit = ({ action, id }) => {
        NotificationRespond.mutate(
            { action, id },
            {
                onSuccess: () => {
                    refetch();
                },
                onError: (error) => {
                    Alert.alert(
                        'Action Failed',
                        error.message || 'Something went wrong'
                    );
                },
            }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <Loader visible={loading} />

            {/* BACKGROUND */}
            <View style={styles.background}>
                <View style={styles.ellipseBig} />
                <View style={styles.ellipseSmall} />
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                <Header showBackButton={true} showNotificationIcon={false} />

                {/* CARD */}
                <View style={styles.cardWrapper}>
                    <View style={styles.cardInner}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Invitation */}
                            {notifications.map((item, index) => (
                                <View key={item._id}>
                                    <View style={styles.item}>
                                        <Text style={styles.text}>{item.message}</Text>

                                        <TimeAgo
                                            date={item.createdAt}
                                            style={styles.time}
                                        />

                                        {item.type === 'pool_invitation' && (
                                            <View style={styles.actionRow}>
                                                <TouchableOpacity
                                                    style={styles.acceptBtn}
                                                    onPress={() =>
                                                        handleSubmit({ action: 'accept', id: item.data?.poolId })
                                                    }
                                                >
                                                    <Text style={styles.acceptText}>Accept</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.declineBtn}
                                                    onPress={() =>
                                                        handleSubmit({ action: 'reject', id: item.data?.poolId })
                                                    }
                                                >
                                                    <Text style={styles.declineText}>Decline</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                    </View>

                                    {index !== notifications.length - 1 && (
                                        <View style={styles.divider} />
                                    )}
                                </View>
                            ))}

                            {/* <View style={styles.divider} />

                            <View style={styles.item}>
                                <Text style={styles.text}>
                                    Ind vs Pakistan match Final Result. WIN WIN WIN
                                </Text>
                                <Text style={styles.time}>1m ago.</Text>
                            </View> */}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 10
    },

    /* BACKGROUND */
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,   // ✅ full height
        zIndex: 0,
    },


    ellipseBig: {
        position: 'absolute',
        width: 420,
        height: 420,
        backgroundColor: 'rgba(135,206,235,0.45)',
        borderRadius: 210,
        top: -160,
        right: -240,
    },

    ellipseSmall: {
        position: 'absolute',
        width: 550,
        height: 550,
        backgroundColor: 'rgba(135,206,235,0.25)',
        borderRadius: 250,
        top: -320,
        right: -140,
    },

    content: {
        flex: 1,
        zIndex: 1,
    },

    cardWrapper: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        height: "85%",
        backgroundColor: '#FFFFFF', // ✅ solid for clean shadow

        shadowColor: '#000',
        shadowOpacity: 0.12,        // 🔽 softer
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },

        elevation: 8,               // 🔽 lower elevation
    },


    cardInner: {
        borderRadius: 16,
        padding: 16,

        backgroundColor: 'rgba(255,255,255,0.65)',

        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
    },



    /* ITEMS */
    item: {
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.TEXT,
        lineHeight: 20,
    },

    time: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: Colors.SUBTEXT,
        marginTop: 4,
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 14,
    },

    /* ACTIONS */
    actionRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 12,
    },

    acceptBtn: {
        backgroundColor: '#2F3E3E',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    acceptText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: Colors.WHITE,
    },

    declineBtn: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    declineText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
    },
});
