import { User } from "@/@types";
import { get, ref, set, update } from "firebase/database";
import { database } from ".";

export async function getUser(uid: string): Promise<User> {
  const response = await get(ref(database, `users/${uid}`));
  return response.val();
}

export async function saveUser(uid: string, fields: Partial<User>, isNew: boolean = false) {
  if (isNew) {
    await set(ref(database, `users/${uid}`), fields);
  } else {
    await update(ref(database, `users/${uid}`), fields);
  }
}
