export interface RegisterForm {
  name: string;
  birthDate: string;
  password: string;
  gender: string;
  email: string;
}
export interface User {
  uid: string;
  role: "nurse" | "admin" | "user";
  medicalData?: UserMedicalData;
  name: string;
  birthdate: string;
  gender: string;
  email: string;
}
export type Message =
  | {
      id: string;
      message: string;
      date: number;
      sender: string;
      isImage: false;
    }
  | {
      id: string;
      image: string;
      date: number;
      infected?: boolean;
      isImage: true;
      sender: string;
    };
export interface Chat {
  id: string;
  user: User;
  date: string;
  nurse?: User | undefined;
  messages: Message[];
}
export type LabTestResult = {
  Test: string;
  Result: number;
  Diagnosis: "In-range" | "Out of range" | "Unknown range";
};
export function isNurse(user: User) {
  return user.role === "nurse";
}

export function isPatient(user: User) {
  return user.role === "user";
}

export function isAdmin(user: User) {
  return user.role === "admin";
}
export interface UserMedicalData {
  weight: string;
  height: string;
}

export interface LabTest {
  file: string;
  date: string;
}
export interface Wound {
  woundImage: string;
  date: number;
  infected: boolean;
}

export interface IAuthContext {
  user: User | undefined | null;
  labTests: Array<LabTest>;
  wounds: Array<Wound>;
  error: unknown;
  loading: boolean;
  setLoading: (b: boolean) => void;
  clearErrors: () => void;
  updateUser: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
}
