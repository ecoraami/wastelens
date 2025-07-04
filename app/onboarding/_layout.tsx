import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="location" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}