import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';

import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn, myurl } from '../components';


const url = myurl;

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null);


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

    const handleLogout = async () => {
        const router = useRouter();
        try {
            const tok = await AsyncStorage.getItem('userData');
            const token = JSON.parse(tok);

            // Include the token in the request headers
            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };

            // Make a POST request to the logout endpoint
            await axios.post(url + 'logout/', null, config);
            await AsyncStorage.removeItem('userData');
            setUserData(null);
            console.log("Logged out");
            router.back();

        } catch (error) {
            console.error('Logout Failed:', error);
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
                    headerTitle: "My Profile",
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {userData ? (
                        <View style={styles.userInfo}>
                            <Text style={styles.userInfoText}>Username: <Text style={styles.userInfoMain}>{userData.username}</Text></Text>
                            <Text style={styles.userInfoText}>First Name: <Text style={styles.userInfoMain}>{userData.first_name}</Text></Text>
                            <Text style={styles.userInfoText}>Last Name: <Text style={styles.userInfoMain}>{userData.last_name}</Text></Text>
                            <Text style={styles.userInfoText}>Password: <Text style={styles.userInfoMain}>{userData.pass_show}</Text></Text>
                        </View>
                    ) : (
                        <ActivityIndicator color={COLORS.primary} size="large" style={{height: 190}}/>
                    )}

                    <TouchableOpacity onPress={handleLogout} style={styles.resultBtn}>
                        <Text style={styles.signupNav}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    container: {
        padding: 20,
    },
    userInfo: {
        display: "flex",
        justifyContent: "center",
        gap: 7,
    },
    userInfoText: {
        fontSize: 18,
        fontFamily: FONT.medium,
        marginVertical: 10,
        color: COLORS.gray,
        borderBottomWidth: 1,
        borderColor: COLORS.primary,
    },
    userInfoMain: {
        fontSize: 18,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
    },
    resultBtn: {
        marginVertical: 15,
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
    signupNav: {
        fontFamily: FONT.bold,
    },
});

export default ProfileScreen;
