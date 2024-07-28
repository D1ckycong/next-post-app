import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../middleware";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "../config/config";

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
  },
}));

jest.mock("next-firebase-auth-edge", () => ({
  authMiddleware: jest.fn(),
  redirectToHome: jest.fn(),
  redirectToLogin: jest.fn(),
}));

jest.mock("../config/config", () => ({
  clientConfig: { apiKey: "test-api-key" },
  serverConfig: {
    cookieName: "test-cookie-name",
    cookieSignatureKeys: ["test-key"],
    cookieSerializeOptions: {},
    serviceAccount: {},
  },
}));

describe("middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function mockRequest(url: string) {
    return {
      nextUrl: new URL(url),
      url: url,
      headers: new Headers(),
    } as unknown as NextRequest;
  }

  it("should call authMiddleware with the correct parameters", async () => {
    const request = mockRequest("https://example.com/auth/login");

    await middleware(request);

    expect(authMiddleware).toHaveBeenCalledWith(request, expect.any(Object));
    const authMiddlewareConfig = (authMiddleware as jest.Mock).mock.calls[0][1];

    expect(authMiddlewareConfig.loginPath).toBe("/api/login");
    expect(authMiddlewareConfig.logoutPath).toBe("/api/logout");
    expect(authMiddlewareConfig.apiKey).toBe(clientConfig.apiKey);
    expect(authMiddlewareConfig.cookieName).toBe(serverConfig.cookieName);
    expect(authMiddlewareConfig.cookieSignatureKeys).toEqual(
      serverConfig.cookieSignatureKeys
    );
    expect(authMiddlewareConfig.cookieSerializeOptions).toEqual(
      serverConfig.cookieSerializeOptions
    );
    expect(authMiddlewareConfig.serviceAccount).toEqual(
      serverConfig.serviceAccount
    );
  });

  it("should redirect to /posts if token is valid and path is public", async () => {
    const request = mockRequest("https://example.com/auth/login");
    const headers = new Headers();
    const token = "valid-token";
    const decodedToken = { uid: "test-uid" };

    (authMiddleware as jest.Mock).mockImplementation((req, config) => {
      return config.handleValidToken({ token, decodedToken }, headers);
    });

    const response = await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/posts", request.url)
    );
  });

  it("should call NextResponse.next if token is valid and path is not public", async () => {
    const request = mockRequest("https://example.com/posts");
    const headers = new Headers();
    const token = "valid-token";
    const decodedToken = { uid: "test-uid" };

    (authMiddleware as jest.Mock).mockImplementation((req, config) => {
      return config.handleValidToken({ token, decodedToken }, headers);
    });

    const response = await middleware(request);

    expect(NextResponse.next).toHaveBeenCalledWith({
      request: {
        headers,
      },
    });
  });

  it("should redirect to login if token is invalid", async () => {
    const request = mockRequest("https://example.com/posts");

    (authMiddleware as jest.Mock).mockImplementation((req, config) => {
      return config.handleInvalidToken("invalid token");
    });

    const response = await middleware(request);

    expect(redirectToLogin).toHaveBeenCalledWith(request, {
      path: "auth/login",
      publicPaths: [
        "/auth/register",
        "/auth/login",
        "/auth/reset-password",
        "/",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/reset-password",
      ],
    });
  });

  it("should handle errors and redirect to login", async () => {
    const request = mockRequest("https://example.com/posts");

    (authMiddleware as jest.Mock).mockImplementation((req, config) => {
      return config.handleError(new Error("test error"));
    });

    const response = await middleware(request);

    expect(redirectToLogin).toHaveBeenCalledWith(request, {
      path: "auth/login",
      publicPaths: [
        "/auth/register",
        "/auth/login",
        "/auth/reset-password",
        "/",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/reset-password",
      ],
    });
  });
});
