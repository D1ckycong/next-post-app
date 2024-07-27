"use client";

import { useState, FormEvent } from "react";
import styles from "@/styles/ProfileModal.module.css";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Profile } from "@/types/Profile";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function EditProfile({
  isOpen,
  onClose,
  profile,
}: EditProfileProps) {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    birthdate: profile.birthdate,
    gender: profile.gender,
    profileIcon: null as File | null,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
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
    setIsChanged(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      setError("新しいパスワードが一致しません。");
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSubmit.append(key, value as any);
      }
    });

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formDataToSubmit,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          onClose();
          setFormData({
            username: formData.username,
            email: formData.email,
            birthdate: formData.birthdate,
            gender: formData.gender,
            profileIcon: null,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
          window.location.reload();
        } else {
          setError(result.error);
        }
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError("予期しないエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <MdClose className={styles.closeIcon} onClick={onClose} />
        <h2 className={styles.modalTitle}>プロフィールを編集</h2>
        {error && <p className={styles.error}>{error}</p>}
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
              className={styles.inputField}
            />
          </div>
          <div className={styles.passwordToggle}>
            <button
              type="button"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
              className={styles.toggleButton}
            >
              パスワードの変更はこちら
            </button>
          </div>
          {isPasswordVisible && (
            <div className={styles.passwordFields}>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="現在のパスワード"
                className={styles.inputField}
              />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="新しいパスワード"
                className={styles.inputField}
              />
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="新しいパスワード（確認用）"
                className={styles.inputField}
              />
            </div>
          )}
          <div className={styles.buttons}>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={!isChanged}
            >
              {isLoading ? "更新中..." : "更新"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
