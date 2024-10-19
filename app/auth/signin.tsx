import colors from "@/assets/colors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Text, TextField, View } from "react-native-ui-lib";
function normalizeError(error: any) {
  const message = error?.message;
  if (message?.includes("invalid-email") || message?.includes("missing-email")) {
    return "Invalid email address";
  }
  if (message?.includes("missing-password")) {
    return "Invalid password";
  }
  if (message?.includes("")) return message;
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, user, error } = useAuth();
  const router = useRouter();
  const onSignIn = async () => {
    try {
      await login(email, password);
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);
  return (
    <View flex style={{ width: "90%", alignSelf: "center", marginTop: 64 }}>
      <TextField
        placeholder={"Enter Email address"}
        floatingPlaceholder
        onChangeText={setEmail}
        enableErrors
        validate={["required"]}
        validationMessage={["Field is required"]}
        showCharCounter
        fieldStyle={style.textFields}
        maxLength={30}
      />

      <TextField
        placeholder={"Enter Password"}
        floatingPlaceholder
        onChangeText={setPassword}
        enableErrors
        secureTextEntry
        fieldStyle={style.textFields}
        validate={["required"]}
        validationMessage={["Field is required"]}
        showCharCounter
        maxLength={30}
      />

      {(error as any) && (
        <Text red10 style={style.padded}>
          {normalizeError(error)}
        </Text>
      )}

      <Button style={style.button} onPress={onSignIn}>
        <Text style={style.buttonText}>Sign in</Text>
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  textFields: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    padding: 8,
    height: 50,
    marginTop: 16,
    backgroundColor: colors.orange,
  },
  buttonText: {
    fontSize: 20,
    color: colors.whiteText,
  },
  padded: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
