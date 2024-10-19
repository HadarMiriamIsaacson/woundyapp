import axios from "axios";
import { LabTestResult } from "./@types";


export async function getLabTestAnalysis(fileUrl: string) {
  const { data } = await axios.post("http://10.0.0.22:8000/upload_test", { file_url: fileUrl });
  return data as LabTestResult[];
}
