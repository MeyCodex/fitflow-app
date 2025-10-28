import "../global.css";
import "@/src/i18n/config";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="routine/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="execute/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-routine"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="add-exercise"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="edit-routine"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="edit-exercise"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="routine-completed"
        options={{ presentation: "fullScreenModal", headerShown: false }}
      />
    </Stack>
  );
}
