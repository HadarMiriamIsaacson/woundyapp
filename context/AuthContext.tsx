import React, { useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "@/firebase";
import { IAuthContext, LabTest, RegisterForm, User, Wound } from "@/@types";
import { getUser, saveUser } from "@/firebase/auth_service";
import { log, LogType } from "@/firebase/log_service";
import { onValue, ref, Unsubscribe } from "firebase/database";

const AuthContext = React.createContext<IAuthContext | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);

  const [labTests, setLabTests] = useState<Array<LabTest>>([]);
  const [wounds, setWounds] = useState<Array<Wound>>([]);

  const clearErrors = () => {
    setError(undefined);
  };
  useEffect(() => {
    let labTestsUnsubscribe: Unsubscribe | undefined;
    let woundsUnsubscribe: Unsubscribe | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (state) => {
      try {
        if (state) {
          const userFromDatabase = await getUser(state.uid);
          if (userFromDatabase.role === "user") {
            labTestsUnsubscribe = onValue(ref(database, `labTests/${state.uid}`), (e) => {
              let tests: Array<LabTest> = [];
              e.forEach((test) => {
                tests.push(test.val());
              });
              setLabTests(tests);
            });
            woundsUnsubscribe = onValue(ref(database, `wounds/${state.uid}`), (e) => {
              let wounds: Array<Wound> = [];
              e.forEach((test) => {
                wounds.push(test.val());
              });
              setWounds(wounds);
            });
          }

          setUser(userFromDatabase);
        } else {
          setUser(undefined);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    });

    return () => {
      labTestsUnsubscribe && labTestsUnsubscribe();
      woundsUnsubscribe && woundsUnsubscribe();
      unsubscribe();
    };
  }, []);

  async function updateUser(user: User) {
    try {
      setLoading(true);
      await saveUser(user.uid, user);
      setUser(user);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await log({
        type: LogType.UserSignIn,
        email: email,
        date: new Date().toISOString(),
      });
    } catch (e) {
      setError(e);
      throw e;
    }
  }
  async function register(form: RegisterForm): Promise<void> {
    try {
      const response = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const userToDatabase = {
        uid: response.user.uid,
        name: form.name,
        role: "user" as any,
        birthdate: form.birthDate,
        email: form.email,
        gender: form.gender,
      };
      await log({
        type: LogType.UserSignUp,
        email: userToDatabase.email,
        date: new Date().toISOString(),
      });
      await saveUser(response.user.uid, userToDatabase, true);
      setUser(userToDatabase);
    } catch (e) {
      setError(e);
      throw e;
    }
  }
  async function logout(): Promise<void> {
    setLabTests([]);
    setWounds([]);
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        error,
        clearErrors,
        updateUser,
        loading,
        setLoading,
        labTests,
        wounds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context not provided");
  }
  return context;
};
