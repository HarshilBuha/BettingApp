import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors } from '../../assets/fonts/fonts';
import Header from '../components/Header';
import { useUpdatePoolOptions } from '../api/PoolApis';

export default function SuggestCustomOptionsScreen({ navigation, route }) {
    const { poolId, title, options: initialOptions = [] } = route.params;
    const initialOptionCount = initialOptions.length;

    const [options, setOptions] = useState(
        initialOptions.length ? initialOptions : ['', '']
    );

    const { mutate: updateOptions, isPending } = useUpdatePoolOptions();

    const addOption = () => {
        setOptions(prev => [...prev, '']);
    };

    const updateOption = (text, index) => {
        const updated = [...options];
        updated[index] = text;
        setOptions(updated);
    };


    const handleSave = () => {
        const cleanedOptions = options
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0);

        if (cleanedOptions.length < 2) {
            Alert.alert('At least 2 valid options are required');
            return;
        }

        updateOptions(
            { poolId, options: cleanedOptions },
            {
                onSuccess: () => {
                    Alert.alert('Success', 'Options updated successfully');
                    navigation.goBack();
                },
                onError: (err) => {
                    Alert.alert(
                        'Error',
                        err?.message || 'Failed to update options'
                    );
                },
            }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header showBackButton />

            <View style={styles.section}>
                <Text style={styles.title}>Suggest Custom Options</Text>

                <View style={styles.card}>
                    <Text style={styles.question}>{title}</Text>

                    <Text style={styles.label}>Answer Choices *</Text>

                    {options.map((item, index) => {
                        const isReadOnly = index < initialOptionCount;

                        return (
                            <View key={index} style={styles.optionInput}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isReadOnly && styles.readOnlyInput,
                                    ]}
                                    value={item}
                                    placeholder={`Option ${index + 1}`}
                                    placeholderTextColor={Colors.SUBTEXT}
                                    onChangeText={(text) => updateOption(text, index)}
                                    editable={!isReadOnly}        
                                    selectTextOnFocus={!isReadOnly}
                                />

                                {isReadOnly && (
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={16}
                                        color={Colors.SUBTEXT}
                                        style={styles.lockIcon}
                                    />
                                )}
                            </View>
                        );
                    })}


                    <TouchableOpacity style={styles.addBtn} onPress={addOption}>
                        <Text style={styles.addText}>+ Add Choice</Text>
                    </TouchableOpacity>

                    <Text style={styles.helper}>
                        Participants can add choices while making predictions.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.saveButtonContainer}
                    onPress={handleSave}
                    disabled={isPending}
                >
                    <LinearGradient
                        colors={Colors.GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.saveButton,
                            isPending && { opacity: 0.6 },
                        ]}
                    >
                        <Text style={styles.saveText}>
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 10,
    },
    section: {
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.TEXT,
    },
    card: {
        backgroundColor: Colors.GREY,
        borderRadius: 10,
        padding: 20,
    },
    question: {
        fontSize: 12,
        marginBottom: 20,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
    },
    optionInput: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.GREY,
        borderRadius: 8,
        marginBottom: 10,
        position: 'relative',
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        color: Colors.TEXT,
    },
    deleteBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    addBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.TEXT,
        marginTop: 6,
    },
    addText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
    },
    helper: {
        fontSize: 11,
        color: Colors.TEXT,
        marginTop: 8,
        fontFamily: 'Inter-Medium',
    },
    saveButtonContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: Colors.GREY,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    readOnlyInput: {
        backgroundColor: '#F3F3F3',
        color: Colors.SUBTEXT,
    },
    lockIcon: {
        position: 'absolute',
        right: 10,
        top: 12,
    },

});
