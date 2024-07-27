import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { clientConfig, serverConfig } from "@/config/config";
import styles from "@/styles/Mypage.module.css";
import MyPageClient from "@/app/mypage/MyPageClient";
import PostsClient from "@/app/posts/PostsClient";
import { getAllPosts } from "@/services/postService";
import { getProfile } from "@/services/userService";
import { Post } from "@/types/Post";
import { Profile } from "@/types/Profile";

interface ServerSideProps {
  profile: Profile;
  posts: Post[];
}

export default async function Mypage() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    return <p>認証が必要です。</p>;
  }

  const posts = await getAllPosts(tokens.customToken);
  const profile = await getProfile(tokens.customToken);

  return (
    <div className={styles.container}>
      <MyPageClient profile={profile} />
      <PostsClient
        posts={posts.filter((post) => post.user.uid === tokens.decodedToken.user_id)}
      />
    </div>
  );
}
