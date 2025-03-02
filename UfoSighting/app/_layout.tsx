import { Stack } from "expo-router";

export default function RootLayout() {
  return     <Stack>
  <Stack.Screen name="index" options={{ title: 'Home' }} />
  <Stack.Screen name="allSightings" options={{ title: 'About' }} />
  <Stack.Screen name="camera" options={{ title: 'Camera' }} />
</Stack>;
}
