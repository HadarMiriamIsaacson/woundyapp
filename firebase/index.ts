import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as authF from "firebase/auth";

import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const reactiveNativePersistance = (authF as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyCpn8WRFOnRsG8DTqKxK9-Jq_HPqGx0cD8",
  authDomain: "wounday-bed66.firebaseapp.com",
  databaseURL: "https://wounday-bed66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wounday-bed66",
  storageBucket: "wounday-bed66.appspot.com",
  messagingSenderId: "909649672454",
  appId: "1:909649672454:web:f3044ee2a742c7bd130687",
  measurementId: "G-0EGKGKFEMK",
};

const app = initializeApp(firebaseConfig);

export const auth = authF.initializeAuth(app, {
  persistence: reactiveNativePersistance(ReactNativeAsyncStorage),
});
export const database = getDatabase(app);
export const storage = getStorage(app);
