import { isAdmin, isNurse } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { View, TextField, Text, Button } from "react-native-ui-lib";

export default function WelcomeScreen() {
  const router = useRouter();

  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }
  if (user) {
    if (isNurse(user)) return <Redirect href={"/nurse"} />;
    else if (isAdmin(user)) return <Redirect href={"/admin"} />;
    else return <Redirect href={"/main"} />;
  }

  return (
    <View>
      <Text style={{ textAlign: "center", fontWeight: "bold", padding: 32, fontSize: 20 }}>
        Welcome
      </Text>

      <View style={styles.welcomeButtons}>
        <Button
          onPress={() => router.navigate("/auth/signup")}
          style={{ backgroundColor: "orange", marginVertical: 4, width: 200 }}
        >
          <Text style={{ color: "white" }}>Sign up</Text>
        </Button>

        <Button
          onPress={() => router.navigate("/auth/signin")}
          style={{ backgroundColor: "orange", marginVertical: 4, width: 200 }}
        >
          <Text style={{ color: "white" }}>Sign in</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeButtons: {
    flexGrow: 1,
    marginHorizontal: "auto",
    flexDirection: "column",
  },

  button: {
    fontSize: 20,
  },
});
