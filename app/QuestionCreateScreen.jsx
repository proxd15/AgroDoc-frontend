import React, { useState ,useEffect } from 'react';
import { View, TextInput, Text, Button,Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { myurl } from '../components';

const QuestionCreateScreen = () => {
    const router = useRouter();
    const url = myurl;

    const [questionText, setQuestionText] = useState('');

    const handleCreateQuestion = async () => {
        try {
            const tok = await AsyncStorage.getItem('userData');
            const token = JSON.parse(tok);

            const response = await axios.post(url + 'questions/', { text: questionText }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            router.back()
        } catch (error) {
            console.error('Error setting question:', error);
        }
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.lightWhite,
                    },
                    headerShadowVisible: false,
                    headerTitle: "Create Question",
                }}
            />
            <View style={styles.textDabba}>
                <TextInput
                    placeholder="Enter your question here"
                    value={questionText}
                    onChangeText={text => setQuestionText(text)}
                    style={styles.textInputDabba}
                />

                <TouchableOpacity onPress={handleCreateQuestion} style={styles.submitBtn}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textDabba: {
        flex: 1,
        flexDirection: "column",
    },
    textInputDabba: {
        height: 40,
        width: 300,
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    submitBtn: {
        backgroundColor: COLORS.white,
        elevation: 3,
        margin: 20,
        padding: 10,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    submitText: {
        fontFamily: FONT.bold,
        fontSize: 14,
    }
})

export default QuestionCreateScreen;
