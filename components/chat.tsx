import { Chat, Message, User } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/firebase";
import { get, onValue, push, ref, set, Unsubscribe } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextField,
  Dividers,
  Image,
  RadioGroup,
  RadioButton,
  Button,
} from "react-native-ui-lib";
import { Alert, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { uploadImage } from "@/firebase/file_service";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const generateRandomId = () => {
  return "id-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
};
export enum ChatMode {
  Nurse,
  Patient,
}

export type ChatScreenProps =
  | {
      mode: ChatMode.Patient;
    }
  | {
      mode: ChatMode.Nurse;
      uid: string;
    };

export default function ChatScreen(props: ChatScreenProps) {
  const [chat, setChat] = useState<Chat | undefined>();
  const [isInfectedSelected, setIsInfectedSelected] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (!user || props.mode === ChatMode.Nurse) return;
    let unsub: Unsubscribe | undefined;
    const fetchChat = async () => {
      const r = ref(database, `chats/${user.uid}`);
      const c = await get(r);
      if (!c.exists()) {
        await set(r, {
          user,
          date: new Date().toISOString(),
          messages: [],
        });
      }
      unsub = onValue(r, (snap) => {
        setChat(snap.val());
      });
    };
    fetchChat();
    return () => {
      if (unsub) unsub();
    };
  }, [user, props]);

  useEffect(() => {
    if (props.mode !== ChatMode.Nurse) return;
    const chatid = props.uid;
    let unsub: Unsubscribe | undefined;
    const fetchChat = async () => {
      const r = ref(database, `chats/${chatid}`);
      unsub = onValue(r, (snap) => {
        setChat(snap.val());
      });
    };
    fetchChat();
    return () => {
      if (unsub) unsub();
    };
  }, [user, props]);

  const sendMessage = async (imageAsset?: string) => {
    if (!user || !chat || !(message || imageAsset)) return;
    const date = new Date().getTime();
    const msg = {
      id: generateRandomId(),
      sender: user.uid,
      date,
      isImage: imageAsset ? true : false,
    } as Message;
    if (msg.isImage) {
      msg.image = imageAsset!;
    } else {
      msg.message = message;
    }
    if (!chat.messages) {
      chat.messages = [msg];
    } else {
      chat.messages = [...chat.messages, msg];
    }
    try {
      await set(ref(database, `chats/${chat.user.uid}`), chat);
    } catch (e) {
      console.log(e);
    } finally {
      setChat({ ...chat });
      setMessage("");
    }
  };

  const updateWoundState = async (messageId: string) => {
    if (!chat) return;

    const newChat = { ...chat };
    const messageIndex = newChat.messages.findIndex((m) => m.id === messageId);
    const message = newChat.messages[messageIndex];
    if (message.isImage) {
      message.infected = isInfectedSelected;
    }
    try {
      await set(ref(database, `chats/${chat.user.uid}`), newChat);
      if (message.isImage) {
        await push(ref(database, `wounds/${chat.user.uid}`), {
          woundImage: message.image,
          date: new Date().getTime(),
          infected: message.infected,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setChat(newChat);
      setMessage("");
    }
  };
  const openDocumentPicker = async () => {
    try {
      if (!user) return;
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
      }
      let doc = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only pick images
        allowsEditing: true, // Allow image cropping
        aspect: [4, 3], // Aspect ratio for cropping (optional)
        quality: 1, // Image quality (0 - low, 1 - high)
      });
      if (!doc.assets) return;
      setUploadLoading(true);
      const response = await fetch(doc.assets[0].uri);
      const blob = await response.blob();
      const image = await uploadImage(blob, `wounds/${user.uid}/${new Date().toISOString()}`);
      sendMessage(image);
      Alert.alert("Lab tests", "Wound image uploaded successully", [
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

  if (!chat || !chat.nurse) {
    return (
      <View flex style={{ backgroundColor: "white" }}>
        <AnimatedLinearGradient
          start={{ x: 0.1, y: 0.3 }}
          colors={["#f7b733", "#fc4a1a"]}
          style={{ padding: 16 }}
        >
          {props.mode === ChatMode.Patient ? (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Waiting for a nurse...
            </Text>
          ) : (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Chatting with {chat?.user.name}
            </Text>
          )}
        </AnimatedLinearGradient>
      </View>
    );
  }

  return (
    <View flex style={{ flex: 1, height: "100%", flexDirection: "column", padding: 8 }}>
      <Text style={{ flex: 0.2, fontSize: 20, padding: 4, fontWeight: "bold" }}>
        Chat With {props.mode === ChatMode.Patient ? chat.nurse.name : chat.user.name}
      </Text>
      <View style={{ borderWidth: 0.5, borderColor: "gray", marginBottom: 8 }} />
      <View style={{ flex: 4 }}>
        <GestureHandlerRootView>
          <FlatList
            data={chat.messages}
            renderItem={({ item: message }) => {
              if (message.isImage) {
                return (
                  <View>
                    <AnimatedLinearGradient
                      start={{ x: 0.5, y: 0.3 }}
                      colors={
                        user?.uid === message.sender
                          ? ["#7474BF", "#348AC7"]
                          : ["#ECE9E6", "#FFFFFF"]
                      }
                      style={{
                        padding: 16,
                        marginVertical: 8,
                        borderRadius: 100,
                        width: "70%",
                        alignSelf: user?.uid === message.sender ? "flex-end" : "flex-start",
                      }}
                    >
                      <View
                        flex
                        style={{
                          flexDirection: "column",
                          gap: 1,
                          alignSelf: user?.uid === message.sender ? "flex-end" : "flex-start",
                        }}
                      >
                        <Image
                          source={{ uri: message.image }}
                          style={{ width: 100, height: 100, marginHorizontal: 20, borderRadius: 8 }}
                        />
                        {user?.uid === chat.nurse?.uid && (
                          <RadioGroup
                            onValueChange={(e: any) => {
                              setIsInfectedSelected(e === "infected");
                            }}
                            initialValue={
                              message.infected === true
                                ? "infected"
                                : message.infected === false
                                ? "uninfected"
                                : undefined
                            }
                            style={{ flex: 1, flexDirection: "column", gap: 3, marginVertical: 8 }}
                          >
                            <RadioButton
                              disabled={message.infected !== undefined}
                              value="infected"
                              label="Infected"
                              color="red"
                            />
                            <RadioButton
                              disabled={message.infected !== undefined}
                              value="uninfected"
                              label="Not infected"
                              color="green"
                            />
                          </RadioGroup>
                        )}
                        {user?.uid === chat.nurse?.uid && (
                          <Button
                            onPress={() => updateWoundState(message.id)}
                            disabled={message.infected !== undefined}
                            style={{
                              backgroundColor: message.infected !== undefined ? "gray" : "orange",
                            }}
                          >
                            <Text style={{ color: "white" }}>Update wound state</Text>
                          </Button>
                        )}
                      </View>
                    </AnimatedLinearGradient>
                    {user?.uid === chat.user.uid && message.infected !== undefined && (
                      <Text
                        style={{
                          alignSelf: user?.uid === message.sender ? "flex-end" : "flex-start",
                          color: message.infected ? "red" : "green",
                          fontWeight: "bold",
                          paddingHorizontal: 8,
                        }}
                      >
                        Nurse marked wound as {message.infected ? "Infected" : "Uninfected"}
                      </Text>
                    )}
                  </View>
                );
              }
              return (
                <AnimatedLinearGradient
                  start={{ x: 0.5, y: 0.3 }}
                  colors={
                    user?.uid === message.sender ? ["#7474BF", "#348AC7"] : ["#ECE9E6", "#FFFFFF"]
                  }
                  style={{
                    padding: 16,
                    marginVertical: 8,
                    borderRadius: 100,
                    width: "70%",
                    alignSelf: user?.uid === message.sender ? "flex-end" : "flex-start",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: user?.uid === message.sender ? "white" : "gray",
                        fontWeight: "bold",
                      }}
                    >
                      {message.message}
                    </Text>
                  </View>
                </AnimatedLinearGradient>
              );
            }}
          />
        </GestureHandlerRootView>
      </View>
      <View
        style={{
          height: 50,
          flex: 1,
          flexDirection: "row",
          width: 300,
          alignItems: "center",
        }}
      >
        {chat.user.uid === user?.uid && (
          <Ionicons
            onPress={() => openDocumentPicker()}
            size={24}
            color={"gray"}
            name="link-outline"
            style={{ transform: "rotateZ(90deg)" }}
          />
        )}
        <TextField
          value={message}
          onChangeText={setMessage}
          style={{
            width: 300,
            borderColor: "gray",
            height: 40,
            borderWidth: 1, // Optional, for better visibility
            padding: 8,
            marginLeft: 8,
            borderRadius: 5, // Optional, for better styling
          }}
          placeholder="Enter a message"
        />
        <Ionicons
          onPress={() => sendMessage()}
          size={24}
          name="send-outline"
          style={{ paddingLeft: 10 }}
        />
      </View>
      {chat.user.uid === user?.uid && (
        <Text
          style={{
            flex: 0.2,
            transform: "translateY(-30px) translateX(30px)",
            color: "gray",
            fontSize: 12,
          }}
        >
          Upload a wound image by clicking the link icon
        </Text>
      )}
    </View>
  );
}
