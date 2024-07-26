"use client";

import Link from "next/link";
import styles from "@/styles/Header.module.css";
import { useState } from "react";
import NewPostModal from "../posts/NewPostModal";
import { useRouter } from "next/navigation";
import { MdDehaze, MdClose, MdLogout } from "react-icons/md";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSidebarToggle = () => setSidebarOpen(!isSidebarOpen);
  const router = useRouter();

  const handlePostSubmit = () => {
    router.push("/posts");
  };
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    window.location.reload();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menuIcon} onClick={handleSidebarToggle}>
          <MdDehaze size={30} />
        </div>
        <div className={styles.title}>PostTest</div>
        <nav className={styles.nav}>
          <Link href="/posts" className={styles.link}>
            投稿一覧
          </Link>
          <Link href="/mypage" className={styles.link}>
            マイページ
          </Link>
          <button onClick={handleOpenModal} className={styles.link}>
            <MdLogout style={{ marginRight: "5px" }} />
            ログアウト
          </button>
        </nav>
      </header>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarCloseIcon} onClick={handleSidebarToggle}>
          <MdClose size={30} />
        </div>
        <Link
          href="/posts"
          className={styles.sidebarLink}
          onClick={handleSidebarToggle}
        >
          投稿一覧
        </Link>
        <Link
          href="/mypage"
          className={styles.sidebarLink}
          onClick={handleSidebarToggle}
        >
          マイページ
        </Link>
        <button onClick={handleLogout} className={styles.sidebarLink}>
          <MdLogout style={{ marginRight: "5px" }} />
          ログアウト
        </button>
      </div>
      <NewPostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handlePostSubmit}
      />
    </>
  );
}
