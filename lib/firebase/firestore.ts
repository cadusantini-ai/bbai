import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "./config";

export const db = getFirestore(app);

export function userCollection(userId: string, col: string) {
  return collection(db, "users", userId, col);
}

export async function addDocument<T extends object>(
  userId: string,
  col: string,
  data: T
) {
  return addDoc(userCollection(userId, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument<T extends object>(
  userId: string,
  col: string,
  docId: string,
  data: Partial<T>
) {
  const ref = doc(db, "users", userId, col, docId);
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(userId: string, col: string, docId: string) {
  const ref = doc(db, "users", userId, col, docId);
  return deleteDoc(ref);
}

export async function getDocument(userId: string, col: string, docId: string) {
  const ref = doc(db, "users", userId, col, docId);
  return getDoc(ref);
}

export async function queryDocuments(
  userId: string,
  col: string,
  filters: { field: string; value: unknown }[] = [],
  orderByField?: string
) {
  const ref = userCollection(userId, col);
  const constraints = filters.map(({ field, value }) => where(field, "==", value));
  if (orderByField) constraints.push(orderBy(orderByField, "desc"));
  const q = query(ref, ...constraints);
  return getDocs(q);
}
