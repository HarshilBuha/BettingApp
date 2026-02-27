import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/fonts/fonts';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { Images } from '../../assets/Images';
import { useGetPoolResults, useGetProfile } from '../api/ProfileApis';

export default function SummaryScreen({ route }) {
    const { data: poolResults = [], isLoading: isResultsLoading } = useGetPoolResults()
    const { data: userData = [], isLoading: isProfileLoading } = useGetProfile()
    const isLoading = isResultsLoading || isProfileLoading;
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        });
    };
    return (
        <SafeAreaView style={styles.container} >
            <StatusBar translucent backgroundColor="transparent" />
            <Loader visible={isLoading} />

            {/* CONTENT */}
            <View style={styles.content}>
                <Header showBackButton={true} showNotificationIcon={false} />

                {/* CARD */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={{ color: Colors.TEXT, fontSize: 18, fontFamily: 'Inter-SemiBold', marginHorizontal: 16, textAlign: "center" }}>Summary</Text>
                    <View style={styles.winningWrapper}>
                        <View style={styles.winningCard}>
                            <Image source={Images.Trophy} style={{ height: 25, width: 25, tintColor: Colors.WHITE }} resizeMode='contain' />
                            <Text style={styles.winningText}>
                                Total Winnings: {userData?.user?.totalPoints}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.joined}>Joined on {formatDate(userData?.user?.createdAt)}</Text>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <Image source={Images.Trophy} style={{ height: 20, width: 20 }} />
                                <Text style={styles.sectionTitle}>Pool Results</Text>
                            </View>
                        </View>

                        {poolResults.length === 0 && (
                            <Text style={{ color: Colors.SUBTEXT }}>
                                No poolResults found
                            </Text>
                        )}

                        {poolResults.map(result => (
                            <View
                                key={result.id}
                                style={[
                                    styles.resultCard,
                                    result.resultInfo?.userResult === 'won' ? styles.win : styles.loss,
                                    { shadowColor: result.resultInfo?.userResult === 'won' ? '#00796B' : '#C80202' }
                                ]}
                            >
                                <Text style={styles.resultTitle}>{result.title}</Text>
                                <Text style={styles.resultText}>
                                    Category : {result.category}
                                </Text>
                                <Text style={styles.resultText}>
                                    Your Prediction : {result.prediction}
                                </Text>

                                <View
                                    style={result.resultInfo?.userResult === 'won' ? styles.winBadge : styles.lossBadge}
                                >
                                    <Text style={styles.badgeText}>
                                        {result.resultInfo?.userResult === 'won'
                                            ? `Win Points : +${result.resultInfo?.pointsEarned}`
                                            : `Lost Points : ${result.resultInfo?.pointsLost}`}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

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
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
    scrollContent: {
        paddingBottom: 20, // safe space for last card
    },
    winningWrapper: {
        marginHorizontal: 16,
        marginTop: 16,
        alignItems: "center"
    },
    winningCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    winningText: {
        color: Colors.WHITE,
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
    joined: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: Colors.SUBTEXT,
        marginTop: 8,
        textAlign: "center"
    },
    section: {
        marginVertical: 20,
        marginHorizontal: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: Colors.DARKGREY,
    },

    resultCard: {
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#C80202',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    loss: {
        borderWidth: 1,
        borderColor: '#C80202',
        backgroundColor: '#F5E6E8',
    },
    win: {
        borderWidth: 1,
        borderColor: '#00796B',
        backgroundColor: '#CCF3EE',
    },
    resultTitle: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: Colors.DARKGREY,
    },
    resultText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.SUBTEXT,
        marginTop: 2,
    },
    lossBadge: {
        backgroundColor: "#C80202",
        alignSelf: 'flex-start',
        borderRadius: 25,
        paddingHorizontal: 25,
        paddingVertical: 4,
        marginTop: 8,

    },
    winBadge: {
        backgroundColor: '#01C2A8',
        alignSelf: 'flex-start',
        borderRadius: 25,
        paddingHorizontal: 25,
        paddingVertical: 4,
        marginTop: 8,
    },
    badgeText: {
        fontSize: 10,
        color: Colors.WHITE,
        fontFamily: 'Inter-Medium',
    },
});
