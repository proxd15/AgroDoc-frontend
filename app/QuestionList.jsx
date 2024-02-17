import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';

import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { HoveringButton, myurl } from '../components';


const QuestionListScreen = () => {
    const router = useRouter();
    const isFocused = useIsFocused();
    const url = myurl;

    const [questions, setQuestions] = useState(null);

    useEffect(() => {

        const fetchQuestions = async () => {
            try {
                const tok = await AsyncStorage.getItem('userData');
                const token = JSON.parse(tok);

                const response = await axios.get(url + 'questions/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setQuestions(response.data.slice().reverse());
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [isFocused]);

    function formatDate(datetimeString) {
        const dateTime = new Date(datetimeString);

        // Format date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateTime.toLocaleDateString(undefined, options);

        // Format time
        const formattedTime = dateTime.toLocaleTimeString();

        return formattedDate + ' at ' + formattedTime;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.lightWhite,
                    },
                    headerShadowVisible: false,
                    headerTitle: "Questions",
                }}
            />

            {questions === null ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
            ) : (
                <View>
                    <FlatList
                        data={questions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.mainDabba} onPress={() => router.push({ pathname: "QuestionDetailScreen", params: { questionId: item.id } })}>
                                <Text style={styles.user}>{item.user}</Text>
                                <Text style={styles.questionText}>{item.text}</Text>
                                <Text style={styles.dateTime}>{formatDate(item.created_at)}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <HoveringButton pathname="QuestionCreateScreen" text="+" btm={15} rit={16} bgClr={COLORS.gray} ftSize={27} />

                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainDabba: {
        backgroundColor: "#f5f5f5",
        margin: 10,
        padding: 10,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: COLORS.gray,
        justifyContent: "center",
        gap: 5,
    },
    questionText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
    },
    user: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
    },
    dateTime: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.gray,
    },
});

export default QuestionListScreen;
