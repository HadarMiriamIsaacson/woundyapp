import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import AuthContextProvider from "@/context/AuthContext";
import { NurseContextProvider } from "@/context/NurseContext";
import { ChoosenFileContextProvider } from "@/context/ChoosenFileContex";
import axios from "axios";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <AuthContextProvider>
      <ChoosenFileContextProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="auth">
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="nurse" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />

            <Stack.Screen name="main" options={{ headerShown: false }} />
            <Stack.Screen
              name="medicalrecord"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="chat"
              options={{
                title: "Chat",
              }}
            />
            <Stack.Screen name="labtest" options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen
              name="labtest_analysis"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="labtest_admin"
              options={{ headerShown: false, presentation: "modal" }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </ChoosenFileContextProvider>
    </AuthContextProvider>
  );
}
