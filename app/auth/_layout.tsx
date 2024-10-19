import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen name="welcome" options={{ headerTitle: "Woundy" }} />
      <Stack.Screen name="signin" options={{ headerTitle: "Woundy - Sign in" }} />
      <Stack.Screen name="signup" options={{ headerTitle: "Woundy - Sign up" }} />
    </Stack>
  );
}
