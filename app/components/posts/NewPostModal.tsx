"use client";

import { useState, FormEvent } from "react";
import styles from "@/styles/PostModal.module.css";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { content: string }) => void;
}

export default function NewPostModal({
  isOpen,
  onClose,
  onSubmit,
}: NewPostModalProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 140) {
      setError("内容は140文字以内で入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        onSubmit({ content });
        setContent("");
        onClose();
        window.location.reload();
      } else {
        setError("投稿に失敗しました。");
      }
    } catch (error) {
      setError("エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <MdClose className={styles.closeIcon} onClick={onClose} />
        <h2 className={styles.modalTitle}>新規投稿</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容"
            className={styles.textarea}
            required
          />
          <div
            className={`${styles.charCount} ${
              content.length > 140 ? styles.exceed : ""
            }`}
          >
            {content.length}/140
          </div>
          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.button}>
              キャンセル
            </button>
            <button type="submit" className={styles.button}>
              {isLoading ? "投稿中..." : "投稿"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
