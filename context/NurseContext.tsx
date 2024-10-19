import { Chat, User } from "@/@types";
import { getPatients, getWaitingChats } from "@/firebase/user_service";
import * as userService from "@/firebase/user_service";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface INurseContext {
  patients: User[];
  waitingList: Chat[];
  handlePatientChat: (chat: Chat) => Promise<void>;
  refreshWaitingList: () => void;
}

const NurseContext = React.createContext<INurseContext | null>(null);

export const NurseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<User[]>([]);
  const { user: nurse } = useAuth();
  const [waitingList, setWaitingList] = useState<Chat[]>([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const results = await getPatients();
        setPatients(results);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPatients();
    refreshWaitingList();
  }, []);

  const handlePatientChat = async (chat: Chat) => {
    if (!nurse) return;
    await userService.handlePatientChat(chat, nurse);
    setWaitingList(waitingList.filter((w) => w.user.uid !== chat.user.uid));
  };

  const refreshWaitingList = async () => {
    try {
      const results = await getWaitingChats();
      setWaitingList(results);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <NurseContext.Provider value={{ patients, waitingList, refreshWaitingList, handlePatientChat }}>
      {children}
    </NurseContext.Provider>
  );
};

export const useNurseContext = () => {
  const context = React.useContext(NurseContext);

  if (!context) {
    throw new Error("Nurse context not provided");
  }
  return context;
};
