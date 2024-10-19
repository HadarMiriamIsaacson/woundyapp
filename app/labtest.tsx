import { useAuth } from "@/context/AuthContext";
import { storage } from "@/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, Dimensions, SafeAreaView } from "react-native";
import { Button } from "react-native-ui-lib";
import WebView from "react-native-webview";
import * as XLSX from "xlsx";
const LabTest = () => {
  const [data, setData] = useState<any[]>([]);
  const [f, setF] = useState<string | null>(null);
  const router = useRouter();
  const { fileName } = useLocalSearchParams();
  const { user } = useAuth();
  useEffect(() => {
    const fetchFile = async () => {
      if (!user) return;
      getDownloadURL(ref(storage, `labTests/${user.uid}/${fileName}`))
        .then(setF)
        .catch(console.log);
    };
    fetchFile();
  }, [user, fileName]);
  /* useEffect(() => {
    const renderFile = async () => {
      try {
        const response = await fetch(file as string);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = (e.target as any).result;
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setData(jsonData);
        };

        reader.readAsArrayBuffer(blob);
      } catch (err: any) {
        console.log("Error: ", err);
        Alert.alert("Error reading file", err.message);
      }
    };
    //renderFile();
  }, []);*/
  if (!user) return null;

  return (
    <View style={{ flex: 1,marginTop: 50 }}>
      <Button
        style={{ backgroundColor: "orange", margin: 16 }}
        onPress={() => {
          router.push("/labtest_analysis");
        }}
      >
        <Text>View Analysis</Text>
      </Button>
      <Button
        style={{ backgroundColor: "orange", marginBottom: 16, marginHorizontal: 16 }}
        onPress={() => {
          router.back();
        }}
      >
        <Text>Close</Text>
      </Button>
      {/* {data && (
        <View>
          {data.map((row, index) => (
            <Text key={index}>{JSON.stringify(row)}</Text>
          ))}
        </View>
      )} */}
      {f && (
        <WebView
          source={{ uri: f }}
          scalesPageToFit={true} // For older versions
          javaScriptEnabled={true} // Enable JavaScript for enhanced functionality
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          textZoom={10}
          startInLoadingState={true}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          bounces={false}
        />
      )}
    </View>
  );
};

export default LabTest;
