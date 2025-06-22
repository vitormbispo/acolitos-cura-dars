import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { menuStore } from './store/store';
import { StackRouter } from '@react-navigation/native';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Inter-Regular': require('@/src/app/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/src/app/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('@/src/app/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('@/src/app/fonts/Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('@/src/app/fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('@/src/app/fonts/Inter-Light.ttf'),
    'Inter-SemiBold': require('@/src/app/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('@/src/app/fonts/Inter-Thin.ttf'),
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
          // Adicione esta configuração para garantir o tema claro
          navigationBarColor: '#FFFFFF', // Para Android
          statusBarStyle: 'dark',        // Ícones escuros na barra de status
        }}
      />
    </View>
  );
}
