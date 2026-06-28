import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";
import app from "./config";

export const storage = getStorage(app);

export function uploadExamFile(userId: string, examId: string, file: File): UploadTask {
  const path = `users/${userId}/exams/${examId}/${file.name}`;
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file, { contentType: file.type });
}

export function examStoragePath(userId: string, examId: string, fileName: string) {
  return `users/${userId}/exams/${examId}/${fileName}`;
}

export async function getFileUrl(path: string): Promise<string> {
  return getDownloadURL(ref(storage, path));
}
