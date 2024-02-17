import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { FONT, SIZES, COLORS, icons } from '../../constants';
import { useRouter } from 'expo-router';


const HoveringButton = ({pathname, text, btm, rit, bgClr, ftSize}) => {
    const router = useRouter();
    return (
        <View style={styles.containerX(btm, rit)}>
            <TouchableOpacity style={styles.buttonX(bgClr)} onPress={() => router.push({ pathname: pathname })}>
                <Text style={styles.textX(ftSize)}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // Hovering button
    containerX: (btm, rit) => ({
        position: 'absolute',
        bottom: btm,
        right: rit,
        opacity: 0.8,
    }),
    buttonX: (bgClr) => ({
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: bgClr,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    textX: (ftSize) => ({
        fontSize: ftSize,
        color: COLORS.white,
        fontWeight: 'bold',
    }),
})

export default HoveringButton
