import { get, onValue, orderByChild, orderByValue, query, ref, set } from "firebase/database";
import { database } from ".";
import { Chat, User } from "@/@types";
import { Log, log, LogType } from "./log_service";

export function listenLogs(callback: (logs: Log[]) => void) {
  const r = ref(database, "admin/logs");
  return onValue(r, (snapshot) => {
    let logs = [] as Log[];
    snapshot.forEach((l) => {
      logs.push(l.val());
    });
    callback(logs);
  });
}
export function listenUsers(callback: (logs: User[]) => void) {
  const r = ref(database, "users");
  return onValue(r, (snapshot) => {
    let logs = [] as User[];
    snapshot.forEach((l) => {
      if (l.child("role").val() !== "admin") logs.push(l.val());
    });
    callback(logs);
  });
}
export async function getPatients() {
  const userSnapshots = await get(query(ref(database, "users"), orderByChild("role")));
  let users = [] as User[];
  userSnapshots.forEach((u) => {
    if (u.child("role").val() === "user") users.push(u.val());
  });
  return users;
}

export async function getWaitingChats() {
  const waitingList = await get(ref(database, "chats"));
  let chats = [] as Chat[];
  waitingList.forEach((c) => {
    if (!c.child("nurse").exists()) chats.push(c.val());
  });
  chats.sort((c1, c2) => new Date(c1.date).getTime() - new Date(c2.date).getTime());
  return chats;
}

export async function handlePatientChat(chat: Chat, nurse: User) {
  chat.nurse = nurse;
  await log({
    type: LogType.NurseHandleUser,
    nurseName: nurse.name,
    userEmail: chat.user.email,
    date: new Date().toISOString(),
  });
  await set(ref(database, `chats/${chat.user.uid}`), chat);
  return chat;
}

export async function getNurseChats(nurse: User) {
  const list = await get(ref(database, "chats"));
  let chats = [] as Chat[];
  list.forEach((c) => {
    if (c.child("nurse").child("uid").val() === nurse.uid) chats.push(c.val());
  });
  chats.sort((c1, c2) => new Date(c1.date).getTime() - new Date(c2.date).getTime());
  return chats;
}
