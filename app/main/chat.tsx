import ChatScreen, { ChatMode } from "@/components/chat";

export default function UserChat() {
  return <ChatScreen mode={ChatMode.Patient} />;
}
