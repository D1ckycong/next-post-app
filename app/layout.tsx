import "@/styles/globals.css";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { Tokens, getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { User } from "@/contexts/AuthContext";
import { AuthProvider } from "@/app/components/auth/AuthProvider";
import { serverConfig, clientConfig } from "@/config/config";
import Header from "@/app/components/common/Header";

const toUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  };
};

export default async function RootLayout({
  children,
}: {
  children: JSX.Element;
}) {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="ja">
      <head />
      <body className={user ? "user-logged-in" : ""}>
        {user && <Header />}
        <main>
          <AuthProvider user={user}>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
