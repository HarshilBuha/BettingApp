import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';

const ConfirmModal = ({ visible, onClose, onConfirm }) => {

    return (
        <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Are you sure you want to declare this result?
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.noButton} onPress={onClose}>
                            <Text style={styles.noText}>No</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onConfirm}
                        >
                            <Text style={styles.actionText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};


export default ConfirmModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: "70%",
        backgroundColor: Colors.GREY,
        borderRadius: 16,
        borderColor: Colors.SUBTEXT,
        borderWidth: 1,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#2E2E2E',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    title: {
        fontSize: 14,
        color: Colors.TEXT,
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: "Inter-Medium",
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
    },
    noButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 28,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        flex: 1,
        alignItems: "center"
    },
    noText: {
        color: Colors.TEXT,
        fontSize: 12,
        fontFamily: "Inter-Medium",
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 28,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        flex: 1,
        alignItems: "center"
    },
    actionText: {
        color: "#C80202",
        fontSize: 12,
        fontFamily: "Inter-Medium",

    }
});
