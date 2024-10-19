import { push, ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";

import { database, storage } from ".";
import { log, LogType } from "./log_service";

export async function uploadLabTests(
  email: string,
  userId: string,
  uri: string
): Promise<{
  file: string;
  date: string;
}> {
  return new Promise(async (resolve, reject) => {
    try {
      const date = new Date().toISOString();

      const fileRef = storageRef(storage, `labTests/${userId}/${date}`); // Provide a folder path and file name

      // Fetch the file as a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload the Blob to Firebase Storage
      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress can be monitored here (optional)
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              const newLabTestRef = push(ref(database, `labTests/${userId}`));
              await log({ 
                type: LogType.UserLabTestUpload,
                file: downloadURL,
                date: new Date().toISOString(),
                email
              })
              await set(newLabTestRef, {
                date,
                file: downloadURL,
              });
              resolve({
                date,
                file: downloadURL,
              });
            })
            .catch(reject);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export async function uploadImage(bytes: Blob, path: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {

      const fileRef = storageRef(storage, path); // Provide a folder path and file name

      // Fetch the file as a Blob
      // Upload the Blob to Firebase Storage
      const uploadTask = uploadBytesResumable(fileRef, bytes);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress can be monitored here (optional)
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              resolve(downloadURL);
            })
            .catch(reject);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
