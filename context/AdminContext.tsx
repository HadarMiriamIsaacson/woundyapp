import { Chat, User } from "@/@types";
import { getPatients, getWaitingChats } from "@/firebase/user_service";
import * as userService from "@/firebase/user_service";
import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Log } from "@/firebase/log_service";
import { ref, set, Unsubscribe } from "firebase/database";
import { database } from "@/firebase";

interface IAdminContext {
  logs: Log[];
  users: User[];
  toggleRole: (user: User) => Promise<void>;
}

const AdminContext = React.createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const toggleRole = async (user: User) => {
    try {
      await set(ref(database, `users/${user.uid}`), {
        ...user,
        role: user.role === "nurse" ? "user" : "nurse",
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    let unsubLogs = userService.listenLogs(setLogs);
    let unsubUsers = userService.listenUsers(setUsers);
    return () => {
      unsubLogs();
      unsubUsers();
    };
  }, []);

  return (
    <AdminContext.Provider value={{ logs, users, toggleRole }}>{children}</AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = React.useContext(AdminContext);

  if (!context) {
    throw new Error("Admin context not provided");
  }
  return context;
};
