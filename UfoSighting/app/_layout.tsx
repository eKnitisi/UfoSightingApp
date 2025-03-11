import { Stack } from "expo-router";


export default function RootLayout() {
  return     <Stack>
  <Stack.Screen name="index" options={{ title: 'Home' }} />
  <Stack.Screen name="allSightings" options={{ title: 'All sightings' }} />
  <Stack.Screen name="camera" options={{ title: 'Camera' }} />
  <Stack.Screen name="addSighting" options={{ title: 'Add sighting' }} />
  <Stack.Screen name="addSightingInformation" options={{ title: 'Add Info' }} />
  <Stack.Screen name="allUfoData" options={{ title: 'All data' }} />
</Stack>;
}
