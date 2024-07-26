import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signInWithCustomToken } from "firebase/auth";
import { db, auth } from "@/utils/firebaseConfig";
import {
  addPost,
  updatePost,
  deletePost,
  verifyUser,
} from "@/services/postService";

export async function POST(req: NextRequest) {
  try {
    const customToken = await verifyUser();
    if (!customToken) {
      return NextResponse.json({ success: false, message: "認証が必要です。" });
    }

    const { content } = await req.json();
    if (content.length > 140) {
      return NextResponse.json({
        success: false,
        message: "内容は140文字以内で入力してください。",
      });
    }

    const post = await addPost(customToken, content);
    return NextResponse.json({ success: true, id: post.id });
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json({
      success: false,
      message: "投稿に失敗しました。",
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const customToken = await verifyUser();
    if (!customToken) {
      return NextResponse.json({ success: false, message: "認証が必要です。" });
    }

    const { id, content } = await req.json();
    if (content.length > 140) {
      return NextResponse.json({
        success: false,
        message: "内容は140文字以内で入力してください。",
      });
    }

    const success = await updatePost(customToken, id, content);
    return success
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, message: "権限がありません。" });
  } catch (error) {
    console.error("Error updating document: ", error);
    return NextResponse.json({
      success: false,
      message: "更新に失敗しました。",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const customToken = await verifyUser();
    if (!customToken) {
      return NextResponse.json({ success: false, message: "認証が必要です。" });
    }

    const { id } = await req.json();
    const success = await deletePost(customToken, id);
    return success
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, message: "権限がありません。" });
  } catch (error) {
    console.error("Error deleting document: ", error);
    return NextResponse.json({
      success: false,
      message: "削除に失敗しました。",
    });
  }
}
