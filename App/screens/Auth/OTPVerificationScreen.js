import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import OtpInputs from 'react-native-otp-inputs';
import { Colors } from '../../../assets/fonts/fonts';
import { Images } from '../../../assets/Images';
import GradientButton from '../../components/GradientButton';
import {
    useForgotPasswordOTP,
    useForgotPasswordOTPVerify,
} from '../../api/AuthApi';
import Loader from '../../components/Loader';

export default function OTPVerificationScreen({ route }) {
    const email = route.params?.email;
    const otpRef = useRef(null);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    const navigation = useNavigation();
    const resendOtp = useForgotPasswordOTP();
    const verifyOtp = useForgotPasswordOTPVerify();
    const loading = resendOtp.isPending || verifyOtp.isPending

    // ✅ THIS IS THE IMPORTANT PART
    const handleChange = (code) => {
        const cleaned = code.replace(/\D/g, '');

        requestAnimationFrame(() => {
            setOtp(cleaned);
        });
    };


    const handleVerifyOTP = () => {
        if (otp.length !== 4) {
            Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP');
            return;
        }

        verifyOtp.mutate(
            { email, otp },
            {
                onSuccess: () => {
                    navigation.navigate('ResetPassword', { email });
                },
                onError: (error) => {
                    Alert.alert(
                        'OTP Verification Failed',
                        error.message || 'Something went wrong'
                    );
                },
            }
        );
    };

    const handleSendCode = () => {
        setTimer(30);
        otpRef.current?.reset(); // ✅ reset OTP input
        setOtp('');

        resendOtp.mutate(
            { email },
            {
                onError: (error) => {
                    Alert.alert(
                        'Resend Failed',
                        error.message || 'Something went wrong'
                    );
                },
            }
        );
    };

    useEffect(() => {
        if (timer > 0) {
            const t = setTimeout(() => setTimer((t) => t - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [timer]);

    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image source={Images.Back} style={styles.backIcon} />
                </TouchableOpacity>
                <Image source={Images.Logo} style={styles.logoSmall} />
            </View>
            <Loader visible={loading} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Please check your email</Text>
                <Text style={styles.subtitle}>We've sent a code to {email}</Text>

                {/* ✅ OTP INPUT — EXACTLY LIKE YOUR EXAMPLE */}
                <OtpInputs
                    ref={otpRef}
                    handleChange={handleChange}
                    numberOfInputs={4}
                    keyboardType="number-pad"
                    inputStyles={styles.otpBox}
                    clearTextOnFocus
                />

                <GradientButton
                    title="Verify OTP"
                    onPress={handleVerifyOTP}
                    disabled={otp.length !== 4}
                />

                <TouchableOpacity onPress={handleSendCode} disabled={timer !== 0}>
                    <Text style={styles.resend}>
                        Send code again{' '}
                        {timer !== 0 ? `00:${String(timer).padStart(2, '0')}` : ''}
                    </Text>
                </TouchableOpacity>
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
        marginTop: 20,
    },
    backBtn: { padding: 6 },
    backIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    logoSmall: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Poppins-Bold',
        color: Colors.DARKGREY,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
        marginBottom: 30,
    },
    otpBox: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.DARKGREY,
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Inter-SemiBold',
        color: Colors.DARKGREY,
    },
    resend: {
        marginTop: 20,
        textAlign: 'center',
        color: Colors.TEXT,
        fontFamily: 'Inter-SemiBold',
    },
});
