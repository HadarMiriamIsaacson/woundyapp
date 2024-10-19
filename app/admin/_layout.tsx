import { Redirect, Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NurseContextProvider } from "@/context/NurseContext";
import { Button, Text } from "react-native-ui-lib";
import { useAuth } from "@/context/AuthContext";
import { isNurse, isPatient } from "@/@types";
import { FontAwesome } from "@expo/vector-icons";
import { AdminContextProvider } from "@/context/AdminContext";

export default function AdminLayout() {
  const { logout, user } = useAuth();

  if (user) {
    if (isNurse(user)) return <Redirect href={"/nurse"} />;
    else if (isPatient(user)) return <Redirect href={"/main"} />;
  } else {
    return <Redirect href={"/auth"} />;
  }
  return (
    <AdminContextProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            padding: 10, // Adjust this value to add padding to the entire tab bar
          },
        }}
      >
        <Tabs.Screen
          name="logs"
          options={{
            title: "Log history",
            tabBarIcon: () => <AntDesign name="filetext1" size={24} color="black" />,
            headerLeft: () => (
              <Button onPress={() => logout()} style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "red" }}>Sign out</Text>
              </Button>
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Users",
            tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
            headerLeft: () => (
              <Button onPress={() => logout()} style={{ backgroundColor: "transparent" }}>
                <Text style={{ color: "red" }}>Sign out</Text>
              </Button>
            ),
          }}
        />
      </Tabs>
    </AdminContextProvider>
  );
}
