import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { menuStore } from './store/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    InterRegular: require('@/src/app/fonts/Inter-Regular.ttf'),
    InterMedium: require('@/src/app/fonts/Inter-Medium.ttf'),
    InterBold: require('@/src/app/fonts/Inter-Bold.ttf'),
    InterExtraBold: require('@/src/app/fonts/Inter-ExtraBold.ttf'),
    InterExtraLight: require('@/src/app/fonts/Inter-ExtraLight.ttf'),
    InterLight: require('@/src/app/fonts/Inter-Light.ttf'),
    InterSemiBold: require('@/src/app/fonts/Inter-SemiBold.ttf'),
    InterThin: require('@/src/app/fonts/Inter-Thin.ttf'),
  });

  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Stack screenOptions={{
      headerShown:false
    }
      }>

    </Stack>
  );
}
