"use client";

import { useState, FormEvent } from "react";
import styles from "@/styles/PostModal.module.css";
import { MdClose } from "react-icons/md";
import { Post } from "@/types/Post";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onUpdate: (updatedPost: Post) => void;
  onDelete: (postId: string) => void;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onUpdate,
  onDelete,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 140) {
      setError("内容は140文字以内で入力してください。");
      return;
    }

    setIsEditing(true);
    setError("");

    try {
      const response = await fetch(`/api/posts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post.id, content }),
      });

      if (response.ok) {
        const updatedPost = { ...post, content };
        onUpdate(updatedPost);
        onClose();
      } else {
        setError("編集に失敗しました。");
      }
    } catch (error) {
      setError("エラーが発生しました。");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/posts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post.id }),
      });

      if (response.ok) {
        onDelete(post.id);
        onClose();
      } else {
        setError("削除に失敗しました。");
      }
    } catch (error) {
      setError("エラーが発生しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <MdClose className={styles.closeIcon} onClick={onClose} />
        <h2 className={styles.modalTitle}>編集</h2>
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
            <button
              type="button"
              onClick={handleDelete}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              {isDeleting ? "削除中..." : "削除"}
            </button>
            <button type="submit" className={styles.button}>
              {isEditing ? "更新中..." : "更新"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
