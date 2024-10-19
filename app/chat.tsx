import ChatScreen, { ChatMode } from "@/components/chat";
import { useLocalSearchParams } from "expo-router";

export default function NurseChat() {
  const { uid } = useLocalSearchParams();
  return <ChatScreen mode={ChatMode.Nurse} uid={uid as string} />;
}
