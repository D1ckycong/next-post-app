import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./config/config";

const PUBLIC_PATHS = ["/auth/register", "/auth/login", "/auth/reset-password", "/", "/api/auth/login", "/api/auth/register", "/api/auth/reset-password"];

export async function middleware(request: NextRequest) {

  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    enableMultipleCookies: true, // Recommended, but `false` by default to keep backwards compatibility. Set to false on Firebase Hosting due to https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
    handleValidToken: async ({ token, decodedToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/posts", request.url));
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      return redirectToLogin(request, {
        path: "auth/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      return redirectToLogin(request, {
        path: "auth/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    "/api/login",
    "/api/logout",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/reset-password",
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
  ],
};
