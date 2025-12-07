import { Stack } from "expo-router";
export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "card" }}>
      <Stack.Screen name="appointment/[id]" />
    </Stack>
  );
}
