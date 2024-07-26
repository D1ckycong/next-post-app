import { Timestamp } from "firebase-admin/firestore";

export interface Post {
  id: string;
  user: {
    displayName: string;
    photoURL: string;
    uid: string;
  };
  createdAt: Date;
  content: string;
}

export interface PostData {
  id: string;
  user: {
    uid: string;
  };
  createdAt: Timestamp;
  content: string;
}