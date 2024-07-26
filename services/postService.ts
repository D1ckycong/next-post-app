import { db, auth } from "@/utils/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { Post, PostData } from "@/types/Post";
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

export async function getAllPosts(customToken: string): Promise<Post[]> {
  await signInWithCustomToken(auth, customToken);
  const postsCollection = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCollection);

  const posts: Post[] = await Promise.all(
    postsSnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data() as Omit<PostData, "id">;
      const userDoc = await getDoc(doc(db, "users", postData.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: postDoc.id,
          ...postData,
          user: {
            ...postData.user,
            displayName: userData.username,
            photoURL: userData.profileIconUrl,
          },
          createdAt: postData.createdAt.toDate(),
        };
      } else {
        return {
          id: postDoc.id,
          ...postData,
          user: {
            ...postData.user,
            displayName: "Unknown User",
            photoURL: "/default-profile.png",
          },
          createdAt: postData.createdAt.toDate(),
        };
      }
    })
  );

  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addPost(customToken: string, content: string) {
  await signInWithCustomToken(auth, customToken);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const docRef = await addDoc(collection(db, "posts"), {
    content,
    createdAt: new Date(),
    user: {
      uid: user.uid,
    },
  });

  return { id: docRef.id };
}

export async function updatePost(
  customToken: string,
  id: string,
  content: string
) {
  await signInWithCustomToken(auth, customToken);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postDoc = doc(db, "posts", id);
  const postSnap = await getDoc(postDoc);

  if (postSnap.exists() && postSnap.data().user.uid === user.uid) {
    await updateDoc(postDoc, { content });
    return true;
  } else {
    return false;
  }
}

export async function deletePost(customToken: string, id: string) {
  await signInWithCustomToken(auth, customToken);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postDoc = doc(db, "posts", id);
  const postSnap = await getDoc(postDoc);

  if (postSnap.exists() && postSnap.data().user.uid === user.uid) {
    await deleteDoc(postDoc);
    return true;
  } else {
    return false;
  }
}
