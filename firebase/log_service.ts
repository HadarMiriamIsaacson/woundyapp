import { push, ref } from "firebase/database";
import { database } from ".";

export enum LogType {
  UserSignIn = "UserSignIn",
  UserSignUp = "UserSignUp",
  UserLabTestUpload = "UserLabTestUpload",
  NurseHandleUser = "NurseHandleUser",
}

export type Log =
  | {
      type: LogType.UserSignIn;
      email: string;
      date: string;
    }
  | {
      type: LogType.UserSignUp;
      email: string;
      date: string;
    }
  | {
      type: LogType.UserLabTestUpload;
      email: string;
      date: string;
      file: string;
    }
  | {
      type: LogType.NurseHandleUser;
      nurseName: string;
      date: string;
      userEmail: string;
    };

export async function log(log: Log) {
  await push(ref(database, `admin/logs`), log);
}
