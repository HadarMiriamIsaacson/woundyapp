import colors from "@/assets/colors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button, DateTimePicker, Text, TextField, View } from "react-native-ui-lib";

function normalizeError(error: any) {
  const message = error?.message;
  if (message?.includes("invalid-email") || message?.includes("missing-email")) {
    return "Invalid email address";
  }
  return message;
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const { user, error, register, clearErrors } = useAuth();

  const [formErrors, setFormErrors] = useState("");
  const router = useRouter();
  const onSignUp = async () => {
    try {
      if (!name) {
        setFormErrors("Please fill the name field");
        return;
      }
      if (!birthDate) {
        setFormErrors("Please choose birth date");
        return;
      }
      await register({ name, email, password, birthDate, gender });
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const onChangeField = (field: string, value: string) => {
    if (field === "password") {
      setPassword(value);
    } else if (field === "email") {
      setEmail(value);
    } else if (field === "name") {
      setName(value);
    }
    setFormErrors("");
    clearErrors();
  };

  return (
    <View flex style={{ width: "90%", alignSelf: "center", marginTop: 64 }}>
      <TextField
        placeholder={"Enter full name"}
        floatingPlaceholder
        fieldStyle={style.textFields}
        onChangeText={(v) => onChangeField("name", v)}
        enableErrors
        validate={["required"]}
        validationMessage={["Field is required"]}
        showCharCounter
        maxLength={30}
      />

      <TextField
        placeholder={"Enter Email address"}
        floatingPlaceholder
        fieldStyle={style.textFields}
        onChangeText={(v) => onChangeField("email", v)}
        enableErrors
        validate={["required"]}
        validationMessage={["Field is required"]}
        showCharCounter
        maxLength={30}
      />

      <TextField
        placeholder={"Enter Password"}
        floatingPlaceholder
        onChangeText={(v) => onChangeField("password", v)}
        enableErrors
        fieldStyle={style.textFields}
        secureTextEntry
        validate={["required"]}
        validationMessage={["Field is required"]}
        showCharCounter
        maxLength={30}
      />
      <DateTimePicker onChange={(date) => {
        setBirthDate(date.toISOString())
      }} style={style.textFields} placeholder={"Birth date"} mode={"date"} />

      {(error as any) && (
        <Text red10 style={style.padded}>
          {normalizeError(error)}
        </Text>
      )}
      {formErrors && (
        <Text red10 style={style.padded}>
          {formErrors}
        </Text>
      )}

      <Button style={style.button} onPress={onSignUp}>
        <Text style={style.buttonText}>Sign up</Text>
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
