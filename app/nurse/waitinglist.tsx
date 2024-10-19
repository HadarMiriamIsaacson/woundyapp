import { Chat } from "@/@types";
import colors from "@/assets/colors";
import { useAuth } from "@/context/AuthContext";
import { useNurseContext } from "@/context/NurseContext";
import { getNurseChats } from "@/firebase/user_service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Text, View } from "react-native-ui-lib";

export default function WaitingList() {
  const { waitingList, handlePatientChat } = useNurseContext();
  const { user } = useAuth();
  const [nurseChats, setNurseChats] = useState<Chat[]>([]);
  const [refreseNurseChats, setRefreshNurseChats] = useState(false);

  const router = useRouter();
  const openChat = (chat: Chat) => {
    router.push({ pathname: "/chat", params: { uid: chat.user.uid } });
  };
  const handlePatient = async (chat: Chat) => {
    try {
      await handlePatientChat(chat);
      refreshChats();
    } catch (e: any) {
      Alert.alert(e.message);
      console.log(e);
    }
  };

  const refreshChats = () => {
    setRefreshNurseChats((r) => !r);
  };
  useEffect(() => {
    if (!user) return;
    const fetchNurseChats = async () => {
      try {
        const chats = await getNurseChats(user);
        setNurseChats(chats);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNurseChats();
  }, [user, refreseNurseChats]);

  return (
    <View flex style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Waiting patients</Text>
      <GestureHandlerRootView>
        <FlatList
          data={waitingList}
          renderItem={({ item, index }) => (
            <View flex style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ minWidth: 200, fontSize: 18 }}>
                {index + 1}. {item.user.name}
              </Text>
              <Button
                onPress={() => {
                  // handle the patient here
                  handlePatient(item);
                }}
                style={[
                  style.button,
                  { width: 100, height: "auto", marginTop: 0, marginHorizontal: 32 },
                ]}
              >
                <Text style={style.buttonText}>Handle</Text>
              </Button>
            </View>
          )}
        />
      </GestureHandlerRootView>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Open chats</Text>
      <GestureHandlerRootView>
        <FlatList
          data={nurseChats}
          renderItem={({ item, index }) => (
            <View flex style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ minWidth: 200, fontSize: 18 }}>
                {index + 1}. {item.user.name}
              </Text>
              <Button
                onPress={() => {
                  // handle the patient here
                  openChat(item);
                }}
                style={[
                  style.button,
                  { width: 100, height: "auto", marginTop: 0, marginHorizontal: 32 },
                ]}
              >
                <Text style={style.buttonText}>Chat</Text>
              </Button>
            </View>
          )}
        />
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
