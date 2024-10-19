import colors from "@/assets/colors";
import { useNurseContext } from "@/context/NurseContext";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button } from "react-native-ui-lib";

export default function Patients() {
  const { patients } = useNurseContext();
  const router = useRouter();
  return (
    <View flex style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>All patients</Text>
      <GestureHandlerRootView>
        <FlatList
          style={{ padding: 8 }}
          data={patients}
          renderItem={({ item, index }) => {
            return (
              <View flex style={{ flexDirection: "row", alignItems: "center",marginVertical: 8 }}>
                <Text style={{ fontSize: 14 ,width: 100}}>
                  {index + 1}. {item.name}
                </Text>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: "/medicalrecord",
                      params: { user: JSON.stringify(item) },
                    })
                  }
                  style={[
                    style.button,
                    { width: 200, height: "auto", marginTop: 0, marginHorizontal: 32 },
                  ]}
                >
                  <Text style={style.buttonText}>View Medical record</Text>
                </Button>
              </View>
            );
          }}
        />
      </GestureHandlerRootView>
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    padding: 4,
    height: 30,
    width: "80%",
    alignSelf: "center",
    marginTop: 16,
    backgroundColor: colors.orange,
  },
  buttonDisabled: {
    padding: 8,
    height: 40,
    width: "80%",
    alignSelf: "center",
    marginTop: 16,
    backgroundColor: "gray",
  },
  buttonText: {
    fontSize: 14,
    color: colors.whiteText,
  },
  textFields: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
