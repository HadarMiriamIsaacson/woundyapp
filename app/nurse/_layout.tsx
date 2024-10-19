import { Redirect, Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NurseContextProvider } from "@/context/NurseContext";
import { Button, Text } from "react-native-ui-lib";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isNurse, isPatient } from "@/@types";
import { FontAwesome } from "@expo/vector-icons";

export default function NurseLayout() {
  const { logout, user } = useAuth();

  if (user) {
    if (isAdmin(user)) return <Redirect href={"/admin"} />;
    else if (isPatient(user)) return <Redirect href={"/main"} />;
  } else {
    return <Redirect href={"/auth"} />;
  }
  return (
    <NurseContextProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            padding: 10, // Adjust this value to add padding to the entire tab bar
          },
        }}
      >
        <Tabs.Screen
          name="patients"
          options={{
            title: "All patients",
            tabBarIcon: () => <AntDesign name="filetext1" size={24} color="black" />,
            headerLeft: () => (
              <Button onPress={() => logout()} style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "red" }}>Sign out</Text>
              </Button>
            ),
          }}
        />
        <Tabs.Screen
          name="waitinglist"
          options={{
            title: "Chats",
            tabBarIcon: () => <AntDesign name="message1" size={24} color="black" />,
            headerLeft: () => (
              <Button onPress={() => logout()} style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "red" }}>Sign out</Text>
              </Button>
            ),
          }}
        />
      </Tabs>
    </NurseContextProvider>
  );
}
