import { LabTest, User } from "@/@types";
import colors from "@/assets/colors";
import { useAuth } from "@/context/AuthContext";
import { useChoosenFileContext } from "@/context/ChoosenFileContex";
import { database, storage } from "@/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { get, ref } from "firebase/database";
import { getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Text, View } from "react-native-ui-lib";
import WebView from "react-native-webview";
import * as XLSX from "xlsx";
const MedicalRecord = () => {
  const { user }: { user: any } = useLocalSearchParams();

  const [userParsed, setUserParsed] = useState<User | null>(null);

  const {setFileCurrent} = useChoosenFileContext()
  const [labTests, setLabTests] = useState([] as LabTest[]);
  const router = useRouter();
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!user) return;
      const u = JSON.parse(user);
      setUserParsed(u);
      try {
        const results = await get(ref(database, `labTests/${u.uid}`));
        let tests: Array<LabTest> = [];
        results.forEach((test) => {
          tests.push(test.val());
        });
        setLabTests(tests);
      } catch (e) {
        console.log(e);
      }
    };

    fetchLabTests();
  }, []);
  if (!user || !userParsed) return null;

  return (
    <View style={{ flex: 1 }}>
      {/* {data && (
        <View>
          {data.map((row, index) => (
            <Text key={index}>{JSON.stringify(row)}</Text>
          ))}
        </View>
      )} */}
      <Text style={{ marginTop: 16, padding: 4, fontWeight: "bold" }}>
        {userParsed.name} Lab tests
      </Text>
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
                    setFileCurrent(item.file)
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
    </View>
  );
};

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

export default MedicalRecord;
