import colors from "@/assets/colors";
import LogCard from "@/components/logcard";
import { useAdminContext } from "@/context/AdminContext";
import { Alert, StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Button } from "react-native-ui-lib";
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import { useEffect, useState } from "react";
export default function LogsScreen() {
  const { logs } = useAdminContext();
  const [hasPermission,setHasPermission] = useState(false)

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync().then((permissonResponse) => {
      setHasPermission(permissonResponse.status === 'granted')
    }).catch(console.error)
  },[])

  const exportToJson =  async () => {
    if(!hasPermission) {
      MediaLibrary.requestPermissionsAsync().then((permissonResponse) => {
        setHasPermission(permissonResponse.status === 'granted')
      }).catch(console.error)
      return;
    }
    const asString = JSON.stringify(logs)

    const fileUri = FileSystem.documentDirectory  + "logs.json"

    try {
      await FileSystem.writeAsStringAsync(fileUri, asString)
      const asset =await  MediaLibrary.createAssetAsync(fileUri)
      const album = await MediaLibrary.getAlbumAsync("downloads")
      if(album === null) {
       await  MediaLibrary.createAlbumAsync("downloads", asset, true)
      }
      else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
      }
      Alert.alert("File saved to disk as logs.json")
    }
    catch(E) {
      console.log(E.message)
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <Button style={style.button} onPress={exportToJson}>
          <Text style={style.buttonText}>Export to json</Text>
        </Button>
        <FlatList data={logs} renderItem={({ item }) => <LogCard log={item} />} />
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
