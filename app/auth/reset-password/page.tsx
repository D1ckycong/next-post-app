"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("パスワードリセットリンクを送信しました。");
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError("予期しないエラーが発生しました。");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>パスワードリセット</h1>
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
          {message && <div className={styles.message}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            リセットリンクを送信
          </button>
        </form>
        <p className={styles.redirect}>
          <Link href="/auth/login">ログインページに戻る</Link>
        </p>
      </div>
    </main>
  );
}
