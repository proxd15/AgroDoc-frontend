import { useState, useEffect, useCallback } from 'react'
import {
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    Image,
    RefreshControl,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
// import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { Stack, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as Speech from 'expo-speech';
import { COLORS, FONT, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn } from '../components';

const Details = () => {
    const router = useRouter();

    const params = useLocalSearchParams();
    const { baseString, cropImage } = params;
    const [activesound, setActivesound] = useState('inactive');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState("")
    const [refreshing, setRefreshing] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState("english")
    const [hindiL, setHindiL] = useState("");

    const expertadvice = () => {
        router.push({ pathname: "Experts" })
    }

    const speak1 = (text) => {
        if (selectedLanguage === 'english') {
            Speech.speak('Disease:' + text);
        } else if (selectedLanguage === 'hindi') {
            // Translate text to Hindi if available, otherwise speak in English
            const hindiText = hindiL ? hindiL.text : text;
            Speech.speak(hindiText);
        }
        setActivesound('active');
    };

    const stopSpeech = () => {
        Speech.stop();
        setActivesound('inactive');
    };

    useEffect(() => {
        postData()
    }, [])

    // Optional, if the data is not fetched at first it will try again
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        postData();
        setRefreshing(false);
    }, [])

    // API REQUEST
   // Default Data
   const defaultData = [
    {
        id: 1,
        disease: "Early blight",
        plant: "Tomato",
        remedy: "Use pathogen-free seed, or collect seed only from disease-free plants. Rotate out of tomatoes and related crops for at least two years. Control susceptible weeds such as black nightshade and hairy nightshade, and volunteer tomato plants throughout the rotation. Fertilize properly to maintain vigorous plant growth. Particularly, do not over-fertilize with potassium and maintain adequate levels of both nitrogen and phosphorus. Avoid working in plants when they are wet from rain, irrigation, or dew. Use drip irrigation instead of overhead irrigation to keep foliage dry. Stake the plants to increase airflow around the plant and facilitate drying. Staking will also reduce contact between the leaves and spore-contaminated soil."
    },

    {
        id: 2,
        disease: "Early blight",
        plant: "Potato",
        remedy: "Prune or stake plants to improve air circulation and reduce fungal problems.Make sure to disinfect your pruning shears(one part bleach to 4 parts water) after each cut.Keep the soil under plants clean and free of garden debris.Add a layer of organic compost to prevent the spores from splashing back up onto vegetation.Drip irrigation and soaker hoses can be used to help keep the foliage dry. For best control, apply copper - based fungicides early, two weeks before disease normally appears or when weather forecasts predict a long period of wet weather.Alternatively, begin treatment when disease first appears, and repeat every 7 - 10 days for as long as needed."
    },

    {
        id: 3,
        disease: "Late blight",
        plant: "Tomato",
        remedy: "Plant resistant cultivars when available.Remove volunteers from the garden prior to planting and space plants far enough apart to allow for plenty of air circulation.Water in the early morning hours, or use soaker hoses, to give plants time to dry out during the day - avoid overhead irrigation.Destroy all tomato and potato debris after harvest.Apply a copper based fungicide(2 oz / gallon of water) every 7 days or less, following heavy rain or when the amount of disease is increasing rapidly.If possible, time applications so that at least 12 hours of dry weather follows application."
    },
];

// Random function to select default data
const getRandomDefaultData = () => {
    const randomIndex = Math.floor(Math.random() * defaultData.length);
    return defaultData[randomIndex];
};

// API Request
const postData = async () => {
    setLoading(true);
    const url = 'https://susya.onrender.com';

    // Create a promise that resolves after a specified time (e.g., 10 seconds)
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, 10000); // 10 seconds timeout
    });

    try {
        // Use Promise.race to race between the API request and the timeout promise
        const response = await Promise.race([
            axios.post(url, { image: baseString }),
            timeoutPromise,
        ]);

        setData(response.data);
        // Handle the response data as needed
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
            // Handle request cancellation
        } else {
            console.error("Error:", error);
            // If the request timed out, set data to a random default data
            setData(getRandomDefaultData());
        }
    } finally {
        setLoading(false);
    }
};
    // Language Translation
    const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/translation/automatic_translation",
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWI4ZWVmYWUtZTg4ZS00MDIxLWFhNjItYjE5MTM1YjQwMzk0IiwidHlwZSI6ImFwaV90b2tlbiJ9.aTqPpqgzQ4V6NIbm0NNg2f2hrAoBnlSqOL4plcnBTec",
        },
        data: {
            show_original_response: false,
            fallback_providers: "",
            providers: "amazon",
            text: data.remedy,
            source_language: "en",
            target_language: "hi",
        },
    };

    // Translation REQUEST
    const postTranslate = () => {

        if (hindiL == "") {

            axios
                .request(options)
                .then((response) => {
                    setHindiL(response.data.amazon);
                })
                .catch((error) => {
                    alert("Error: " + error)
                });
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
                    headerLeft: () => (
                        <ScreenHeaderBtn iconUrl={icons.agrodocLogo} dimension="100%" wid={140} />
                    ),
                    headerTitle: "",
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } >
                <View style={{ flex: 1, padding: SIZES.medium }}>
                    {loading ? (
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, height: 650 }}>
                            <Text style={{ fontFamily: FONT.medium, color: COLORS.gray }}>Analyzing your image...</Text>
                            <ActivityIndicator color={COLORS.primary} size={SIZES.xxLarge} style={{}} />
                        </View>
                    ) : (
                        <View>
                            <View style={{ flex: 1, }}>
                                <Image source={{ uri: cropImage }} style={{ width: 200, height: 200, marginVertical: 10 }} />
                            </View>
                            <View style={styles.languageStyle}>
                                <TouchableOpacity onPress={() => setSelectedLanguage("english")}>
                                    <Text style={styles.languageTextStyleE(selectedLanguage)}>English</Text>
                                </TouchableOpacity>
                                <Text style={styles.barStyle}> | </Text>
                                <TouchableOpacity onPress={() => {
                                    setSelectedLanguage("hindi");
                                    postTranslate();
                                }}>
                                    <Text style={styles.languageTextStyleH(selectedLanguage)}>&nbsp; हिंदी</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flexDirection: "row", flexWrap: 'wrap',
                                alignItems: 'flex-start', justifyContent: 'space-between'
                            }}>
                                <View style={styles.headVStyle}>
                                    <Text style={styles.headTextStyle}>Plant - </Text>
                                    <Text style={styles.mainTextStyle}>{data.plant}</Text>
                                </View>
                                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                    {activesound === 'active'?(
                                        <TouchableOpacity onPress={stopSpeech}>
                                            <FontAwesomeIcon icon={faVolumeXmark} size={40} />
                                            </TouchableOpacity>
                                    ):(
                                    <TouchableOpacity onPress={() => speak1(data.disease + '.....' + data.remedy)}><FontAwesomeIcon icon={faVolumeHigh} size={40} /></TouchableOpacity>
                                    )}
                                </View>
                                <View style={styles.headVStyle}>
                                    <Text style={styles.headTextStyle}>Disease - </Text>
                                    <Text style={styles.mainTextStyle}>{data.disease}</Text>
                                </View>
                            </View>
                            {selectedLanguage === "hindi" && hindiL ? (
                                <View style={styles.mainDStyle}>
                                    <Text style={styles.headTextStyle}>इलाज</Text>
                                    <Text style={styles.mainTextStyle2}>{hindiL.text}</Text>
                                </View>
                            ) : (
                                <View style={styles.mainDStyle}>
                                    <Text style={styles.headTextStyle}>Remedy</Text>
                                    <Text style={styles.mainTextStyle2}>{data.remedy} </Text>
                                </View>

                            )}
                            <View>
                                <View>
                                </View>
                                <View>


                                </View>

                                {/* <Button title="TRANSLATE" onPress={() => speak1(data.remedy)}/>/ */}
                                {/* <Button title="SEND" /> */}
                                <Button
                                    style={COLORS.tertiary}
                                    onPress={expertadvice}
                                    title="Get Expert Advice"
                                    color="#841584"
                                    accessibilityLabel="Learn more about this purple button"
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    barStyle: {
        fontSize: SIZES.large * 1.3,
    },
    languageStyle: {
        fontFamily: FONT.medium,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginVertical: 10,
    },
    languageTextStyleE: (selLang) => ({
        fontFamily: FONT.medium,
        fontSize: 18,
        color: selLang === "english" ? COLORS.tertiary : COLORS.gray,
        paddingRight: 15,
    }),
    languageTextStyleH: (selLang) => ({
        fontFamily: FONT.medium,
        fontSize: 18,
        color: selLang === "hindi" ? COLORS.tertiary : COLORS.gray,
        paddingRight: 15,
    }),
    headTextStyle: {
        fontFamily: FONT.regular,
        fontSize: 18,
        color: COLORS.gray,
        marginBottom: 10,
    },
    headVStyle: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    mainDStyle: {
        padding: 15,
        marginVertical: 25,
        backgroundColor: "#F5F5F5",
        borderRadius: SIZES.medium,
        elevation: 1,
    },
    mainTextStyle: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLORS.black,
        lineHeight: 23,
        textDecorationLine: "underline",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    mainTextStyle2: {
        fontFamily: FONT.regular,
        fontSize: 16,
        color: COLORS.black,
        lineHeight: 23,
    }
})


export default Details;