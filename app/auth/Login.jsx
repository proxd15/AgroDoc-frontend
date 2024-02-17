import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Stack, useRouter } from 'expo-router'

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FONT, COLORS, icons, images, SIZES } from '../../constants';
import { ScreenHeaderBtn, myurl } from '../../components';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LoginScreen = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const url = myurl;

    const handleLogin = () => {
        axios
            .post(url + 'token/', {
                username: username,
                password: password,
            })
            .then(response => {
                console.log('Success');
                const token = response.data.token;
                // Save user data to AsyncStorage after successful login
                AsyncStorage.setItem('userData', JSON.stringify(token));
                router.back();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Invalid credentials!")
            });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.lightWhite }} behavior="position" enabled>

                <Stack.Screen
                    options={{
                        headerStyle: {
                            backgroundColor: COLORS.lightWhite,
                        },
                        headerShadowVisible: false,
                        headerTitle: "Log in",
                    }}
                />

                    <View style={styles.introSt}>
                        <Text style={styles.introHead}>What will you get when you <Text style={{ color: COLORS.tertiary }}>Login</Text>!</Text>
                        <Text style={styles.allText}>
                            <Text style={styles.introSubHead}>1. Image Diagnosis:</Text> Identify crop diseases through image uploads, offering solutions and symptoms. {'\n'}

                            <Text style={styles.introSubHead}>2. Botanist Consultation:</Text> Connect with experts, send samples for detailed analysis. {'\n'}

                            <Text style={styles.introSubHead}>3. Crop News:</Text> Stay updated with the latest agricultural news. {'\n'}

                            <Text style={styles.introSubHead}>4. Community Hub:</Text> Sign up, connect, and share knowledge with fellow farmers. {'\n'}

                            <Text style={styles.introSubHead}>5. Seasonal Guidance:</Text> Tailored advice on crops, insects, and conditions. {'\n'}

                            <Text style={styles.introSubHead}>6. Multi-Lingual Support:</Text> Available in English and Hindi, with an audio option for illiterate users. {'\n'}

                            <Text style={styles.introSubHead}>7. Voice Search:</Text> Navigate the app using voice commands. {'\n'}

                            <Text style={styles.introSubHead}>8. Market Locator:</Text> Find nearby markets for buying and selling plants/crops.
                        </Text>
                    </View>

                    <View style={styles.loginSt}>
                        <TextInput
                            style={styles.textAreaSt}
                            onChangeText={text => setUsername(text)}
                            value={username}
                            autoCapitalize="none" // Disable first word capitalization
                            placeholder='Username'
                        />

                        <TextInput
                            style={styles.textAreaSt}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry
                            placeholder='Password'
                        />

                        <TouchableOpacity onPress={handleLogin} style={styles.resultBtn}>
                            <Text style={styles.signupNav}>Log in</Text>
                        </TouchableOpacity>

                        <View style={styles.navReg}>
                            <Text style={styles.signupNav}>Don't have an account</Text>
                            <TouchableOpacity onPress={() => router.push({ pathname: "/auth/Register" })}>
                                <Text style={styles.textReg}> Sign Up </Text>
                            </TouchableOpacity>
                            <Text style={styles.signupNav}>instead!</Text>
                        </View>

                    </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    navReg: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    signupNav: {
        fontFamily: FONT.bold,
    },
    textReg: {
        fontFamily: FONT.bold,
        color: "blue",
    },
    introHead: {
        fontFamily: FONT.bold,
        fontSize: 20,
        paddingVertical: 5,
    },
    introSubHead: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLORS.secondary,
    },
    allText: {
        fontFamily: FONT.medium,
        lineHeight: 23,
    },
    introSt: {
        padding: 20,
    },
    loginSt: {
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "center",
        gap: 7,
    },
    textAreaSt: {
        height: 40,
        borderColor: COLORS.gray,
        borderRadius: SIZES.small * 1.5,
        padding: 7,
        borderWidth: 1,
        marginBottom: 10,
        fontFamily: FONT.medium
    },
    resultBtn: {
        backgroundColor: "#F5F5F5",
        elevation: 3,
        fontFamily: FONT.bold,
        borderWidth: 1,
        borderColor: COLORS.gray,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.small * 1.5,
    },
})

export default LoginScreen;
