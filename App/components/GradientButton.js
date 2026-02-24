import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../assets/fonts/fonts';


export default function GradientButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    img
}) {
    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[style, styles.buttonWrapper, { opacity: disabled ? 0.6 : 1 }]}
            >
                <LinearGradient
                    colors={Colors.GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <>
                            {img && <Image source={img} resizeMode='contain' style={styles.img} />}
                            <Text style={styles.buttonText}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Secondary variant with outline
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[styles.secondaryButtonWrapper, { opacity: disabled ? 0.6 : 1 }]}
        >
            <View style={styles.secondaryButton}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.TEXT} />
                ) : (
                    <Text style={styles.secondaryButtonText}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    // PRIMARY GRADIENT BUTTON
    buttonWrapper: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        marginVertical: 20
    },
    img: {
        width: 20,
        height: 20,
    },
    button: {
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: "row",
        gap: 10
    },
    buttonText: {
        color: Colors.GREY,
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },

    // SECONDARY OUTLINE BUTTON
    secondaryButtonWrapper: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
    },
    secondaryButton: {
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: Colors.DARKGREY,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
    },
    secondaryButtonText: {
        color: Colors.DARKGREY,
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
});