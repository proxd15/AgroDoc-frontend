// This will be used for navigation and layout in all pages
import { Stack } from "expo-router"
import { useCallback } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();  // To prevent automatically hiding of splash screen

const Layout = () => {

  // This is the method to use custom fonts
  const [fontLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }  // If fonts get loaded we can hide the splash screen
  }, [fontLoaded])

  if (!fontLoaded) return null;

  return <Stack onLayout={onLayoutRootView}/>
}

export default Layout