import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react';
import { FONT, SIZES, COLORS, icons } from '../constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import HoveringButton from './models/HoveringButton';


const Landing = ({ farmer_img }) => {
  const router = useRouter();
  const isFocused = useIsFocused();

  const [image, setImage] = useState(null);
  const [imgBase64, imgSetBase64] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false)

  const checkLoggedIn = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData !== null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    checkLoggedIn();
  }, [isFocused])


  // PICKING AN IMAGE AND GETTING IT IN BASE64 FORMAT
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    const base64 = result.base64;
    imgSetBase64(base64);
    setIsVisible(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 3000);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (

    <View style={{ flex: 1 }}>
      <View style={styles.farmerContainer}>
        <Image
          source={farmer_img}
          resizeMode='contain'
          style={styles.farmerImg}
        />
      </View>
      <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
        <Text style={styles.agroTitle}>AgroDoc</Text>
        <Text style={styles.headerTitle}>"Your Comprehensive Virtual Companion for All Things Crop Care, Plant Protection, and Greenery Growth."</Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", }}>
        <TouchableOpacity onPress={pickImage} style={styles.btnContainer}>
          <Text style={{ padding: 1, fontFamily: FONT.medium }}>Image</Text>
          <Image
            style={styles.btnImg}
            source={icons.uploadIcon}
            resizeMode='contain'
          />
        </TouchableOpacity>
        {image && (
          <View style={{ flexDirection: "row", gap: 30, alignItems: "flex-end" }}>
            {isVisible ? (
              <Text style={{ paddingHorizontal: 7, color: COLORS.tertiary, }}>Image Uploaded!</Text>
            ) : (
              <Text style={{ paddingHorizontal: 48.7 }}></Text>
            )}
            <TouchableOpacity onPress={() => setImage(null)} style={{ backgroundColor: "#F5F5F5" }}>
              {/* <Text style={{ color: "red", fontFamily: FONT.medium, fontSize: SIZES.medium, textShadowOffset: { height: 1, width: 1 }, textShadowRadius: 5, textDecorationLine: "underline" }}>Remove</Text> */}
              <Image
                source={icons.dustbin}
                resizeMode='contain'
                style={{ width: 40, height: 35 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {image && (
        <View style={styles.imgBox}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />
        </View>
      )}

      {imgBase64 && image ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => router.push({ pathname: "/details", params: { baseString: `${imgBase64}`, cropImage: `${image}` } })} style={styles.resultBtn} >
            <Text style={styles.imgBtnText}>Get results</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View></View>
      )}

      {loggedIn &&
        <View>
          <HoveringButton pathname="QuestionList" text="Q/A" btm={-2} rit={16} bgClr={COLORS.tertiary} ftSize={16}/>

          <View style={styles.containerX}>
            <TouchableOpacity style={styles.buttonX} onPress={() => router.push({ pathname: "ChatBot" })}>
                <Image
                  source={icons.chatBot}
                  resizeMode='contain'
                  style={{ width: 50, height: 50 }}
                />
            </TouchableOpacity>
        </View>
        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    marginLeft: 30,
    width: 120,
    height: 47,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.medium * 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  btnImg: {
    width: 30,
    height: 50,
    borderRadius: SIZES.small / 1.25,
  },
  farmerContainer: {
    flex: 1,
    margin: 7,
    width: 350,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  farmerImg: {
    flex: 1,
    width: 250,
    height: 100,
  },
  headerTitle: {
    padding: 10,
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    textAlign: "center",
  },
  agroTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.tertiary,
  },
  imgBtn: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    height: 50,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SIZES.large * 1.5,
    borderRadius: SIZES.small / 1.25,
  },
  resultBtn: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginLeft: SIZES.large * 1.5,
    marginRight: SIZES.large * 1.5,
    borderRadius: SIZES.small * 1.5,
  },
  imgBtnText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontFamily: FONT.bold,
  },
  imgBox: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginLeft: 30,
    padding: 5,
    width: 230,
  },

  // Hovering button
  containerX: {
    position: 'absolute',
    bottom: -2,
    right: 75,
    opacity: 0.8,
  },
  buttonX: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textX: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  }
});

export default Landing