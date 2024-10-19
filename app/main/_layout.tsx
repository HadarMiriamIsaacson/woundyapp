import { Redirect, Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button, Text } from "react-native-ui-lib";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isNurse } from "@/@types";

export default function MainLayout() {
  const { logout, user } = useAuth();
  if (user) {
    if (isNurse(user)) return <Redirect href={"/nurse"} />;
    else if (isAdmin(user)) return <Redirect href={"/admin"} />;
  } else {
    return <Redirect href={"/auth"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          padding: 10, // Adjust this value to add padding to the entire tab bar
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Medical Profile",
          tabBarIcon: () => <AntDesign name="filetext1" size={24} color="black" />,
          headerLeft: () => (
            <Button onPress={() => logout()} style={{ backgroundColor: "transparent" }}>
              <Text style={{ color: "red" }}>Sign out</Text>
            </Button>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: () => <Entypo name="chat" size={24} color="black" />,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
