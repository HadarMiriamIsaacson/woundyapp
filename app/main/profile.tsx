import { isAdmin, isNurse, UserMedicalData } from "@/@types";
import colors from "@/assets/colors";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { View, Text, TextField, Button, Image } from "react-native-ui-lib";
import * as DocumentPicker from "expo-document-picker";
import { uploadLabTests } from "@/firebase/file_service";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useChoosenFileContext } from "@/context/ChoosenFileContex";

function calcBMI(userData: UserMedicalData) {
  const numerator = +userData.weight;
  const denom = Math.pow(+userData.height / 100,2);
  return (numerator / denom).toFixed(3);
}
export default function ProfileScreen() {
  const { user, loading, updateUser, labTests, wounds } = useAuth();
  const [uploadLoading, setUploadLoading] = useState(false);
  const { setFileCurrent } = useChoosenFileContext();
  const router = useRouter();
  const [newWeight, setNewWeight] = useState((user?.medicalData?.weight ?? 0).toString());
  const [newHeight, setNewHeight] = useState((user?.medicalData?.height ?? 0).toString());

  const isSameData = () => {
    return (
      !newHeight ||
      !newWeight ||
      (newWeight === "0" && newHeight === "0") ||
      (newWeight === user?.medicalData?.weight && newHeight === user?.medicalData?.height)
    );
  };

  const openDocumentPicker = async () => {
    try {
      if (!user) return;
      const doc = await DocumentPicker.getDocumentAsync();
      if (!doc.assets) return;
      setUploadLoading(true);
      let asset = doc.assets[0].uri;

      await uploadLabTests(user.email, user.uid, asset);
      Alert.alert("Lab tests", "Lab tests uploaded successully", [
        {
          text: "Close",
        },
      ]);
    } catch (e: any) {
      Alert.alert(e.message);
    } finally {
      setUploadLoading(false);
    }
  };
  const onSaveChanges = async () => {
    if (!user) return;
    await updateUser({ ...user, medicalData: { height: newHeight, weight: newWeight } });
  };

  return (
    <View flex style={{ padding: 8 }}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0, 0.5)",
          width: 100,
          borderRadius: 16,
          alignItems: "center",
          padding: 8,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontStyle: "italic",
            color: colors.whiteText,
          }}
        >
          Hello {user?.name}
        </Text>
      </View>

      <View style={{ padding: 8 }}>
        <Text style={{ fontWeight: "bold" }}>Weight</Text>
        <TextField
          placeholder={"Enter Weight (kg)"}
          floatingPlaceholder
          value={newWeight.toString()}
          keyboardType="decimal-pad"
          onChangeText={(e) => {
            if (!e) {
              setNewWeight("");
              return;
            }
            for (var x of e) {
              if (x === ".") continue;
              const val = parseFloat(x);
              if (isNaN(val)) return;
            }
            const val = parseFloat(e);
            if (isNaN(val)) {
              return;
            }
            setNewWeight(e);
          }}
          fieldStyle={style.textFields}
          defaultValue={user?.medicalData?.weight.toString()}
          enableErrors
          validate={["required"]}
          validationMessage={["Field is required"]}
        />
      </View>

      <View style={{ padding: 8 }}>
        <Text style={{ fontWeight: "bold" }}>Height</Text>
        <TextField
          value={newHeight.toString()}
          keyboardType="decimal-pad"
          fieldStyle={style.textFields}
          placeholder={"Enter Height (cm)"}
          floatingPlaceholder
          onChangeText={(e) => {
            if (!e) {
              setNewHeight("");
              return;
            }
            for (var x of e) {
              if (x === ".") continue;
              const val = parseFloat(x);
              if (isNaN(val)) return;
            }
            const val = parseFloat(e);
            if (isNaN(val)) {
              return;
            }
            setNewHeight(e);
          }}
          defaultValue={user?.medicalData?.height.toString()}
          enableErrors
          validate={["required"]}
          validationMessage={["Field is required"]}
        />
      </View>
      {user && user.medicalData && user.medicalData.height && (
        <Text style={{ paddingHorizontal: 16, fontWeight: "bold" }}>
          BMI :{calcBMI(user.medicalData)}
        </Text>
      )}

      <Button
        onPress={onSaveChanges}
        disabled={isSameData()}
        style={isSameData() ? style.buttonDisabled : style.button}
      >
        <Text style={style.buttonText}>Save Changes</Text>
      </Button>

      <Button
        disabled={uploadLoading}
        style={uploadLoading ? style.buttonDisabled : style.button}
        onPress={openDocumentPicker}
      >
        <Text style={[style.buttonText, { fontWeight: "bold" }]}>Upload lab tests document</Text>
      </Button>
      {loading && (
        <View flex>
          <ActivityIndicator style={{ padding: 8 }} size="small" color="#0000ff" />
          <Text style={{ padding: 8, textAlign: "center" }}>Saving changes</Text>
        </View>
      )}
      {uploadLoading && (
        <View flex>
          <ActivityIndicator style={{ padding: 8 }} size="small" color="#0000ff" />
          <Text style={{ padding: 8, textAlign: "center" }}>Uploading lab tests..</Text>
        </View>
      )}
      <Text style={{ marginTop: 16, padding: 4, fontWeight: "bold" }}>My Lab tests</Text>
      <GestureHandlerRootView>
        <FlatList
          style={{ padding: 8 }}
          data={labTests}
          renderItem={({ item, index }) => (
            <View>
              <View flex style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ minWidth: 200 }}>
                  {index + 1}. {item.date}
                </Text>
                <Button
                  onPress={() => {
                    setFileCurrent(item.file);
                    router.push({ pathname: "/labtest", params: { fileName: item.date } });
                  }}
                  style={[
                    style.button,
                    { width: 100, height: "auto", marginTop: 0, marginHorizontal: 32 },
                  ]}
                >
                  <Text style={style.buttonText}>View</Text>
                </Button>
              </View>
              <View
                style={{ height: 1, width: "100%", marginVertical: 16, backgroundColor: "gray" }}
              />
            </View>
          )}
        ></FlatList>
      </GestureHandlerRootView>
      <Text style={{ marginTop: 16, padding: 4, fontWeight: "bold" }}>My Wounds</Text>
      <GestureHandlerRootView>
        <FlatList
          style={{ padding: 8 }}
          data={wounds}
          renderItem={({ item, index }) => (
            <View>
              <View flex style={{ flexDirection: "row", alignItems: "center" }}>
                <View flex style={{ flexDirection: "column" }}>
                  <Text style={{ minWidth: 200, color: item.infected ? "red" : "green" }}>
                    {item.infected ? "Nurse marked as infected" : "Nurse marked as not infected"}
                  </Text>
                  <Text style={{ paddingVertical: 4, fontWeight: "bold", minWidth: 200 }}>
                    {new Date(item.date).toDateString()}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.woundImage }}
                  style={{ width: 100, height: 100, marginHorizontal: 20, borderRadius: 8 }}
                />
              </View>
              <View
                style={{ height: 1, width: "100%", marginVertical: 16, backgroundColor: "gray" }}
              />
            </View>
          )}
        ></FlatList>
      </GestureHandlerRootView>
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    padding: 8,
    height: 40,
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
    fontSize: 15,
    color: colors.whiteText,
  },
  textFields: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
