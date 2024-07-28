# Next Post Application

こちらのアプリケーションはコーディングテスト用アプリケーショです。このアプリケーションはNext.jsとFirebaseを使用して構築され、レスポンシブデザインとセキュリティに重点を置いています。

## 目次
- [Next Post Application](#next-post-application)
  - [目次](#目次)
  - [前提条件](#前提条件)
  - [セットアップ](#セットアップ)
  - [使用方法](#使用方法)
  - [テスト](#テスト)
  - [フォルダ構成](#フォルダ構成)
  - [技術スタック](#技術スタック)
  - [作業項目](#作業項目)

## 前提条件
以下のソフトウェアがインストールされている必要があります：
- Node.js (v14以上)
- npm または yarn

## セットアップ
1. リポジトリをクローンします：
    ```sh
    git clone https://github.com/D1ckycong/next-post-app.git
    cd next-post-app
    ```

2. 依存関係をインストールします：
    ```sh
    npm install
    # または
    yarn install
    ```

3. 環境変数を設定します。`.env.local`ファイルをプロジェクトのルートに作成し、以下のように記述します：
    ```env
    NEXT_PUBLIC_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_APP_ID=your_firebase_app_id
    FIREBASE_ADMIN_CLIENT_EMAIL=firebase-admin-client-email
    FIREBASE_ADMIN_PRIVATE_KEY=firebase-admin-private-key
    AUTH_COOKIE_NAME=AuthToken
    AUTH_COOKIE_SIGNATURE_KEY_CURRENT=auth-cookie-signature-key-current
    AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS=auth-cookie-signature-key-previous
    USE_SECURE_COOKIES=true
    ```

4. 開発サーバーを起動します：
    ```sh
    npm run dev
    # または
    yarn dev
    ```

    ブラウザで`http://localhost:3000`にアクセスします。

## 使用方法
1. アプリケーションにアクセスし、ユーザーアカウントを作成します。
2. ログイン後、投稿を行い、投稿一覧ページで他のユーザーの投稿を閲覧します。
3. マイページからプロフィールを編集し、アカウント情報を更新します。

## テスト
ユニットテストと統合テストを実行するには、以下のコマンドを使用します：
```sh
npm run test
# または
yarn test
```
カバレッジレポートを生成するには、以下のコマンドを使用します：
```sh
npm run coverage
# または
yarn coverage
```

## フォルダ構成
```bash
next-post-app/
├── public/
├── app/
│   ├── components/
│   ├── auth/
│   ├── posts/
│   ├── mypage/
│   ├── api/
├── services/
├── context/
├── config/
├── utils/
├── styles/
├── types/
├── __tests__/
├── .env.local
├── jest.config.ts
├── jest.setup.ts
├── middleware.ts
├── next.config.mjs
├── package.json
└── README.md
```

## 技術スタック
- Next.js
- React
- Firebase
- TypeScript
- Jest
- Testing Library

## 作業項目

- [x] Next.js 14のfirebase認証についてリサーチ(3h)
- [x] next-firebase-auth-edgeのドキュメント確認(3h)
- [x] firebase認証/middleware関連の設定(5h)
- [x] トップページ作成(5h)
- [x] 投稿関連ページ作成(6h)
- [x] マイページ作成(4h)
- [x] vercelへのリリース(3h)
