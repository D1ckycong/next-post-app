"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${result.idToken}`,
          },
        });
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (e) {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="メールアドレス"
            className={styles.inputField}
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="パスワード"
            className={styles.inputField}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            ログイン
          </button>
        </form>
        <p className={styles.redirect}>
          アカウントをお持ちでない方は <Link href="/auth/register">こちら</Link>
        </p>
        <p className={styles.redirect}>
          <Link href="/">ホームに戻る</Link>
        </p>
      </div>
    </main>
  );
}
