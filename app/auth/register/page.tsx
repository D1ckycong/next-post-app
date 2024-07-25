"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    gender: "",
    profileIcon: null as File | null,
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "profileIcon" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      setFormData({
        ...formData,
        profileIcon: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSubmit.append(key, value as any);
      }
    });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formDataToSubmit,
      });

      const result = await response.json();
      if (response.ok) {
        router.push("/auth/login");
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
        <h1 className={styles.title}>アカウント作成</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="ユーザー名"
            className={styles.inputField}
          />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="メールアドレス"
            className={styles.inputField}
          />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="パスワード"
            className={styles.inputField}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="パスワードの確認"
            className={styles.inputField}
          />
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="birthdate">
              生年月日
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="gender">
              性別
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className={styles.inputField}
            >
              <option value="" disabled>
                性別を選択
              </option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="profileIcon">
              プロフィールアイコン
            </label>
            <input
              type="file"
              id="profileIcon"
              name="profileIcon"
              accept="image/*"
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              required
            />
            <span>
              <Link
                href="https://www.notion.so/a714620bbd8740d1ac98f2326fbd0bbc?pvs=21"
                target="_blank"
                rel="noopener noreferrer"
              >
                利用規約
              </Link>
              に同意します
            </span>
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            アカウント作成
          </button>
        </form>
        <p className={styles.redirect}>
          既にアカウントをお持ちですか? <Link href="/auth/login">ログイン</Link>
        </p>
        <p className={styles.redirect}>
          <Link href="/">ホームに戻る</Link>
        </p>
      </div>
    </main>
  );
}
