import { LabTestResult } from "@/@types";
import { useChoosenFileContext } from "@/context/ChoosenFileContex";
import { getLabTestAnalysis } from "@/network";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button } from "react-native-ui-lib";
const LabTestAnalysis = () => {
  const { fileCurrent } = useChoosenFileContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<LabTestResult[]>([]);
  useEffect(() => {
    const fetchAnlysis = async () => {
      console.log("fetchAna")
      setTimeout(async () => {

      if (fileCurrent) {
        try {
          setLoading(true);
          console.log("Start reading")
          const results = await getLabTestAnalysis(fileCurrent);
          console.log("Read")
          setResults(results);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      }
    }, 500)
    };
    fetchAnlysis();
  }, [fileCurrent]);

  return (
    <View style={{ flex: 1 ,marginTop: 50}}>
      {loading && (
        <View flex>
          <ActivityIndicator style={{ padding: 8 }} size="small" color="#0000ff" />
          <Text style={{ padding: 8, textAlign: "center" }}>Analysing</Text>
        </View>
      )}
      {results && results.length > 0 ? (
        <View flex style={{ padding: 16 }}>
          <Text style={{ fontWeight: "bold", paddingBottom: 16 }}>Lab tests Analysis: </Text>
          <GestureHandlerRootView>
            <FlatList
              data={results}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    borderRadius: 8,
                    padding: 8,
                    borderColor:
                      item.Diagnosis === "In-range"
                        ? "green"
                        : item.Diagnosis === "Out of range"
                        ? "red"
                        : "orange",
                    borderWidth: 1,
                    marginVertical: 8,
                  }}
                >
                  <View flex style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold" }}>{item.Test}</Text>
                    <Text
                      style={{
                        color:
                          item.Diagnosis === "In-range"
                            ? "green"
                            : item.Diagnosis === "Out of range"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {item.Diagnosis}
                    </Text>
                  </View>
                  <Text>Result: {item.Result}</Text>
                </View>
              )}
            />
          </GestureHandlerRootView>
          <Button onPress={() => router.back()} style={{ backgroundColor: "orange", margin: 16 }}>
            <Text style={{ color: "white" }}>Close</Text>
          </Button>
        </View>
      ) : !loading ? (
        <View>
          <Text style={{ padding: 16 }}>
            There was a problem analysing the tests, please try again later
          </Text>
          <Button onPress={() => router.back()} style={{ backgroundColor: "orange", margin: 16 }}>
            <Text style={{ color: "white" }}>Close</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default LabTestAnalysis;
