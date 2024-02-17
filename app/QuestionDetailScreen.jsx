import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { myurl } from '../components';

const QuestionDetailScreen = () => {
    const url = myurl;
    const router = useRouter();

    const params = useLocalSearchParams();
    const { questionId } = params;
    const [question, setQuestion] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchReplies();
        fetchQuestion();
    }, [questionId]);

    const fetchQuestion = async () => {
        try {
            const tok = await AsyncStorage.getItem('userData');
            const token = JSON.parse(tok);
            
            const response = await axios.get(url + `questions/${questionId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setQuestion(response.data);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const fetchReplies = async () => {
        try {
            const tok = await AsyncStorage.getItem('userData');
            const token = JSON.parse(tok);

            const response = await axios.get(url + `questions/${questionId}/replies/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setReplies(response.data.slice().reverse());
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleReplySubmit = async () => {
        try {
            const tok = await AsyncStorage.getItem('userData');
            const token = JSON.parse(tok);

            const response = await axios.post(url + `questions/${questionId}/replies/create/`, { text: replyText }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log("Reply created successfully");
            fetchReplies();
            setReplyText("")
            setReplies(response.data);
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    }

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
                    headerTitle: "Question & Answers",
                }}
            />

            {question ? (
                <View style={styles.mainDabbaS}>
                    <Text style={styles.mainTextS}>{question?.text}</Text>
                    {replies.length === 0 && (
                        <Text style={styles.noRepl}>No replies yet!</Text>
                    )}
                    <FlatList
                        data={replies}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.localDabbaS}>
                                <Text style={styles.replyUser}>{item.user}</Text>
                                <Text style={styles.replyText}>{item.text}</Text>
                                <Text style={styles.replyCreated}>{formatDate(item.created_at)}</Text>
                            </View>
                        )}
                    />

                    <View style={styles.textDabba}>
                        <TextInput
                            placeholder="Type your reply here"
                            value={replyText}
                            onChangeText={text => setReplyText(text)}
                            style={styles.textInputDabba}
                        />
                        <TouchableOpacity onPress={handleReplySubmit} style={styles.submitBtn}>
                            <Text style={styles.submitText}>Add Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            ) : (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textDabba: {
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
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        width: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    submitText: {
        fontFamily: FONT.bold,
        fontSize: 14,
    },
    mainDabbaS: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 15,
    },
    localDabbaS: {
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        justifyContent: "center",
        gap: 5,
    },
    mainTextS: {
        fontSize: SIZES.large,
        fontFamily: FONT.medium,
        padding: 15,
    },
    replyUser: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
    },
    replyText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
    },
    replyCreated: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.gray,
    },
    noRepl: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.gray,
        padding: 17,
    }
})

export default QuestionDetailScreen;
