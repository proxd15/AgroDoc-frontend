import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, View, Image } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myurl } from '../components';
import uuid from 'react-native-uuid';
import { Bubble } from "react-native-gifted-chat/lib/GiftedChat";

import { icons, COLORS, FONT } from '../constants';


const ChatBotScreen = () => {
    const url = myurl;
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState(null);
    const [load, setLoad] = useState(false)
    const id = 1;

    // Fetch user Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const tok = await AsyncStorage.getItem('userData');
                const token = JSON.parse(tok);

                const response = await axios.get(url + 'user_detail/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userData === null) {
            fetchUserData();
        }
    }, []);

    const onSend = async (newMessages = []) => {
        setLoad(true);
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

        // Send the user's message to your chatbot API
        try {
            const response = await axios.post('https://open-ai21.p.rapidapi.com/conversationgpt35', {
                messages: [
                    // ...messages,
                    { role: 'user', content: newMessages[0].text }
                ],
                web_access: false,
                stream: false
            }, {
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': 'f602b58a7bmsh99a07d1572890b3p132c54jsna03c8600606a',
                    'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
                },
            });
            setMessages(previousMessages => GiftedChat.append(previousMessages, [{
                _id: uuid.v4(),
                text: response.data.result,
                createdAt: new Date(),
                user: { _id: 2, name: "BOT" },
            }]));
            setLoad(false)
        } catch (error) {
            console.error(error);
        }
    };

    const customBubbleStyle = {
        right: {
            backgroundColor: "#93C572",
            padding: 3,
        },
        left: {
            backgroundColor: "#E5E4E2",
            padding: 3,
        },
    };

    const CustomSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 8 }}>
                    <Image
                        source={icons.sendBtn}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.tertiary,
                        }}
                    />
                </View>
            </Send>
        );
    };

    return (
        <>
            {messages.length === 0 && (
                <Text style={{ textAlign: "center", padding: 15, marginTop: 20, fontSize: 16, color: COLORS.darkgray, fontFamily: FONT.medium }}>
                    "AgroBot: Cultivating Conversations, Growing Solutions" {"\n\n"} Start a conversation with the bot...</Text>
            )}

            {load && (
                <ActivityIndicator size="small" color={COLORS.tertiary} style={{ justifyContent: "center", alignItems: "flex-end", padding: 10, }} />
            )}
            {userData ? (
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: id, name: userData.username }}
                    renderBubble={(props) => (
                        <Bubble {...props} wrapperStyle={customBubbleStyle} />
                    )}
                    renderSend={CustomSend}
                    textInputStyle={{
                        lineHeight: 24,
                    }}
                />
            ) : (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
            )}

        </>

    );
}

export default ChatBotScreen;