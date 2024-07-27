import { db, auth } from "@/utils/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { Profile } from "@/types/Profile";
import { cookies } from "next/headers";

export async function verifyUser() {
  const customCookies = cookies().get("AuthToken.custom");
  if (!customCookies) {
    return null;
  }

  const customToken = customCookies.value;
  if (customToken === "undefined") {
    return null;
  }

  await signInWithCustomToken(auth, customToken);
  return customToken;
}

export async function getProfile(customToken: string): Promise<Profile> {
  await signInWithCustomToken(auth, customToken);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }
  const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
        throw new Error("User not found");
    }
    const profile = userDoc.data() as Profile;
  return profile;
}