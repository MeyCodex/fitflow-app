import { Stack } from "expo-router";

export default function AppStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="routine/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="execute/[id]" options={{ headerShown: true }} />
    </Stack>
  );
}
