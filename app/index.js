import { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { COLORS, icons, images, SIZES } from '../constants';
import { Landing, ScreenHeaderBtn } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Experts from './Experts';

const Home = () => {
  const router = useRouter();
  const isFocused = useIsFocused();

  const [userDataExists, setUserDataExists] = useState(false);

  const checkUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        setUserDataExists(true);
        console.log(userData);
      } else {
        setUserDataExists(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserData();
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.agrodocLogo} dimension="100%" pathname="" wid={140} />
          ),
          headerRight: () => (
            userDataExists ? (
              <ScreenHeaderBtn iconUrl={icons.profile} dimension="40%" pathname="/Profile" wid={70} />
            ) : (
              <ScreenHeaderBtn iconUrl={icons.login} dimension="40%" pathname="/auth/Login" wid={70} />
            )
          ),
          headerTitle: "",
        }}
      />
   

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Landing farmer_img={images.farmer_img} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home;