import { Stack } from "expo-router";

export default function ModalStackLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen name="create-routine" />
      <Stack.Screen name="add-exercise" />
      <Stack.Screen name="edit-routine" />
      <Stack.Screen name="edit-exercise" />
      <Stack.Screen
        name="routine-completed"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
