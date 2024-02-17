import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { myurl } from '../../components';
import { Stack, useRouter } from 'expo-router';

import { FONT, COLORS, icons, images, SIZES } from '../../constants';

const RegisterScreen = () => {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const url = myurl;

    const handleRegister = () => {

        if (password === confirmPassword) {
            axios
                .post(url + 'register/', {
                    username: username,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    pass_show: confirmPassword,
                })
                .then(response => {
                    console.log('Success');
                    router.back();

                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Username already taken!"); // need to customize this error message
                });
        }
        else {
            alert('Passwords do not match');
        }
    };

    return (

        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.lightWhite }} behavior="position" enabled>

            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.lightWhite,
                    },
                    headerShadowVisible: false,
                    headerTitle: "Sign up",
                }}
            />

            <Image
                source={images.farmer_sign}
                resizeMode="contain"
                style={{
                    width: 350,
                    height: 250,
                    alignSelf: "center",
                    marginVertical: 25,
                }}
            />
            <Text style={styles.welcomeFar}>Welcome <Text style={{color: COLORS.tertiary}}>Farmer!</Text></Text>
            <View>
                <View style={styles.mainV}>

                    <View style={styles.flSt}>
                        <TextInput
                            style={styles.textAreaStFlex}
                            onChangeText={text => setFirstName(text)}
                            value={firstName}
                            placeholder='First name'
                        />

                        <TextInput
                            style={styles.textAreaStFlex}
                            onChangeText={text => setLastName(text)}
                            value={lastName}
                            placeholder='Last name'
                        />
                    </View>

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

                    <TextInput
                        style={styles.textAreaSt}
                        onChangeText={text => setConfirmPassword(text)}
                        value={confirmPassword}
                        autoCapitalize="none"
                        secureTextEntry
                        placeholder='Confirm password'
                    />


                    <TouchableOpacity onPress={handleRegister} style={styles.resultBtn}>
                        <Text style={styles.signupNav}>Sign up</Text>
                    </TouchableOpacity>

                    <View style={styles.navReg}>
                        <Text style={styles.signupNav}>Don't have an account</Text>
                        <TouchableOpacity onPress={() => router.push({ pathname: "/auth/Login" })}>
                            <Text style={styles.textReg}> Log in </Text>
                        </TouchableOpacity>
                        <Text style={styles.signupNav}>instead!</Text>
                    </View>
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
    textReg: {
        color: "blue",
        fontWeight: "bold",
    },
    mainV: {
        padding: 20,
        gap: 7,

    },
    textAreaStFlex: {
        height: 40,
        borderColor: COLORS.gray,
        borderRadius: SIZES.small * 1.5,
        padding: 7,
        borderWidth: 1,
        marginBottom: 10,
        fontFamily: FONT.medium,
        width: "49%",
    },
    textAreaSt: {
        height: 40,
        borderColor: COLORS.gray,
        borderRadius: SIZES.small * 1.5,
        padding: 7,
        borderWidth: 1,
        marginBottom: 10,
        fontFamily: FONT.medium,
    },
    flSt: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    signupNav: {
        fontFamily: FONT.bold,
    },
    textReg: {
        fontFamily: FONT.bold,
        color: "blue",
    },
    welcomeFar: {
        fontFamily: FONT.bold,
        fontSize: 25,
        textAlign: "center",
        marginBottom: 10,
    },
})

export default RegisterScreen;
