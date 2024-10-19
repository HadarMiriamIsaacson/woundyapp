import { useAdminContext } from "@/context/AdminContext";
import { FlatList, GestureHandlerRootView, Switch } from "react-native-gesture-handler";
import { View, Text } from "react-native-ui-lib";

export default function UsersScreen() {
  const { users, toggleRole } = useAdminContext();
  return (
    <View flex>
      <GestureHandlerRootView>
        <FlatList
          data={users}
          renderItem={({ item }) => {
            return (
              <View style={{ paddingVertical: 8 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 4,
                    flex: 1,
                    marginTop: 4,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}> {item.name} </Text>
                    <Text style={{ fontSize: 15, paddingHorizontal: 1, color: "gray" }}>
                      {" "}
                      {item.email}{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      width: 200,
                      padding: 8,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {item.name} is {item.role === "nurse" ? "a nurse" : "not a nurse"}
                    </Text>
                    <Switch value={item.role === "nurse"} onValueChange={() => toggleRole(item)} />
                    <Text style={{ fontSize: 10, paddingVertical: 4, color: "gray" }}>
                      Switch to change role
                    </Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: "black", width: "100%" }} />
              </View>
            );
          }}
        />
      </GestureHandlerRootView>
    </View>
  );
}
