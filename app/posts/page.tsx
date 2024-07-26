import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { clientConfig, serverConfig } from "@/config/config";
import styles from "@/styles/Posts.module.css";
import PostsClient from "./PostsClient";
import { getAllPosts } from "@/services/postService";
// import { useRouter } from "next/router";

export default async function PostsPage() {
  // const router = useRouter();
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

   if (!tokens) {
    // 本来であればmiddleware.tsでリダイレクトされるため、ここには来ない
     return <p>認証が必要です。</p>;
   }

  const posts = await getAllPosts(tokens.customToken);

  return (
    <main className={styles.container}>
      <PostsClient posts={posts} />
    </main>
  );
}
