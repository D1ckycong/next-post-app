"use client";

import styles from "@/styles/Posts.module.css";
import Image from "next/image";
import { Post } from "@/types/Post";
import { useState } from "react";
import EditPostModal from "@/app/components/posts/EditPostModal";
import NewPostModal from "@/app/components/posts/NewPostModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface PostsClientProps {
  posts: Post[];
}

export default function PostsClient({ posts }: PostsClientProps) {
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPosts, setCurrentPosts] = useState(posts);
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handlePostSubmit = () => {
    setModalOpen(false);
    router.refresh();
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
  };

  const handleUpdate = (updatedPost: Post) => {
    setCurrentPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    router.refresh();
  };

  const handleDelete = (postId: string) => {
    setCurrentPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
    router.refresh();
  };

  return (
    <div className={styles.postsContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>タイムライン</h1>
        {pathname !== "/mypage" && (
          <button onClick={handleOpenModal} className={styles.newPostButton}>
            新規投稿
          </button>
        )}
      </header>
      <NewPostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handlePostSubmit}
      />
      {currentPosts.length === 0 ? (
        <p>投稿がありません。</p>
      ) : (
        currentPosts.map((post) => (
          <div key={post.id} className={styles.post}>
            <div className={styles.user}>
              <Image
                src={post.user.photoURL}
                alt="avatar"
                width={50}
                height={50}
                className={styles.avatar}
              />
              <div>
                <p className={styles.displayName}>{post.user.displayName}</p>
                <p className={styles.createdAt}>
                  {new Date(post.createdAt).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <p className={styles.content}>{post.content}</p>
            {user && user.uid === post.user.uid && (
              <>
                <button
                  onClick={() => handleEdit(post)}
                  className={styles.editButton}
                >
                  編集
                </button>
                {selectedPost && selectedPost.id === post.id && (
                  <EditPostModal
                    isOpen={!!selectedPost}
                    onClose={handleClose}
                    post={selectedPost}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
