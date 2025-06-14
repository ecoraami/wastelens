import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ItemsProvider } from '@/contexts/ItemsContext';
import { LocationService } from '@/services/location';
import { router } from 'expo-router';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isDark } = useTheme();
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen name="analysis" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      window.frameworkReady?.();
    }
  }, [fontsLoaded, fontError]);

  // Request location permission when app starts
  useEffect(() => {
    const requestLocationOnStartup = async () => {
      try {
        console.log('🚀 [RootLayout] Requesting location permission on app startup...');
        const granted = await LocationService.requestLocationPermission();
        if (granted) {
          console.log('✅ [RootLayout] Location permission granted');
          // Pre-fetch location to cache it
          await LocationService.getCurrentLocation();
        } else {
          console.log('❌ [RootLayout] Location permission denied');
        }
      } catch (error) {
        console.error('❌ [RootLayout] Error requesting location permission:', error);
      }
    };

    if (fontsLoaded || fontError) {
      requestLocationOnStartup();
      // Auto-navigate to camera on app startup using push instead of replace
      setTimeout(() => {
        router.push('/camera');
      }, 100);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ItemsProvider>
        <RootLayoutContent />
      </ItemsProvider>
    </ThemeProvider>
  );
}