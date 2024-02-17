import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'


import { COLORS, SIZES } from '../../constants'

const ScreenHeaderBtn = ({ iconUrl, dimension, pathname, wid }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.btnContainer(wid)} onPress={() => router.push({ pathname: pathname })}>
      <Image
        source={iconUrl}
        resizeMode='contain'
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btnContainer: (wid) => ({
    width: wid,
    height: 70,
    justifyContent: "center",
    alignItems: "flex-end",
  }),
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
});

export default ScreenHeaderBtn