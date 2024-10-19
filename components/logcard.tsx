import colors from "@/assets/colors";
import { useAdminContext } from "@/context/AdminContext";
import { useChoosenFileContext } from "@/context/ChoosenFileContex";
import { Log, LogType } from "@/firebase/log_service";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Button } from "react-native-ui-lib";

export default function LogCard({ log }: { log: Log }) {
  const router = useRouter();
  const { setFileCurrent } = useChoosenFileContext();
  const Card = useCallback(() => {
    if (log.type === LogType.UserSignIn) {
      return (
        <View style={style.cardContainer}>
          <View style={[style.titleContainer, { justifyContent: "space-between" }]}>
            <View style={[style.titleContainer]}>
              <FontAwesome name="key" />
              <Text style={{ fontWeight: "bold" }}>Sign in action</Text>
            </View>
            <Text style={{ paddingRight: 8, color: "gray" }}>
              {new Date(log.date).toLocaleString()}
            </Text>
          </View>
          <Text style={{ padding: 8 }}>Email: {log.email}</Text>
        </View>
      );
    } else if (log.type === LogType.UserSignUp) {
      return (
        <View style={style.cardContainer}>
          <View style={[style.titleContainer, { justifyContent: "space-between" }]}>
            <View style={[style.titleContainer]}>
              <FontAwesome name="key" />
              <Text style={{ fontWeight: "bold" }}>Sign up action</Text>
            </View>
            <Text style={{ paddingRight: 8, color: "gray" }}>
              {new Date(log.date).toLocaleString()}
            </Text>
          </View>
          <Text style={{ padding: 8 }}>Email: {log.email}</Text>
        </View>
      );
    } else if (log.type === LogType.NurseHandleUser) {
      return (
        <View style={style.cardContainer}>
          <View style={[style.titleContainer, { justifyContent: "space-between" }]}>
            <View style={[style.titleContainer]}>
              <AntDesign name="message1" />

              <Text style={{ fontWeight: "bold" }}>Nurse & User chat</Text>
            </View>
            <Text style={{ paddingRight: 8, color: "gray" }}>
              {new Date(log.date).toLocaleString()}
            </Text>
          </View>
          <View style={[{ flexDirection: "column", marginTop: 8 }]}>
            <Text style={{ paddingVertical: 4 }}>User email: {log.userEmail}</Text>
            <Text style={{ paddingVertical: 4 }}>Handling Nurse: {log.nurseName}</Text>
          </View>
        </View>
      );
    } else if (log.type === LogType.UserLabTestUpload) {
      return (
        <View style={style.cardContainer}>
          <View style={[style.titleContainer, { justifyContent: "space-between" }]}>
            <View style={[style.titleContainer]}>
              <AntDesign name="file1" />

              <Text style={{ fontWeight: "bold" }}>User Lab test upload</Text>
            </View>
            <Text style={{ paddingRight: 8, color: "gray" }}>
              {new Date(log.date).toLocaleString()}
            </Text>
          </View>
          <View style={[style.titleContainer, { justifyContent: "space-between", marginTop: 8 }]}>
            <Text style={{ paddingHorizontal: 8 }}>Email: {log.email}</Text>
            <Button
              style={style.button}
              onPress={() => {
                setFileCurrent(log.file);
                router.push({
                  pathname: "/labtest_admin",
                });
              }}
            >
              <Text style={style.buttonText}>View Document</Text>
            </Button>
          </View>
        </View>
      );
    }
  }, [log]);
  return (
    <View style={style.container}>
      <Card />
    </View>
  );
}

const style = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "column",
  },
  titleContainer: {
    padding: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    margin: 8,
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0.2 },
  },
  buttonText: {
    fontSize: 13,
    color: colors.whiteText,
  },
  button: {
    alignSelf: "center",
    backgroundColor: colors.orange,
  },
});
