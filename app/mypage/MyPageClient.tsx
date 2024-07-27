"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/Mypage.module.css";
import EditProfile from "@/app/components/mypage/EditProfile";
import Image from "next/image";
import { Profile } from "@/types/Profile";

interface MyPageClientProps {
  profile: Profile;
}

export default function MyPageClient({ profile }: MyPageClientProps) {
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenEditProfileModal = () => setEditProfileModalOpen(true);
  const handleCloseEditProfileModal = () => setEditProfileModalOpen(false);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>マイページ</h1>
      <div className={styles.profile}>
        <div className={styles.profileDetails}>
          <Image
            src={profile.profileIconUrl || "/default-profile.png"} // デフォルトのプロフィール画像を指定
            alt="プロフィール画像"
            width={100}
            height={100}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <p>ユーザー名: {profile.username}</p>
            <p>メール: {profile.email}</p>
            <p>生年月日: {profile.birthdate}</p>
            <p>性別: {profile.gender}</p>
          </div>
        </div>
        <div className={styles.profileButtons}>
          <button
            onClick={handleOpenEditProfileModal}
            className={styles.editProfileButton}
          >
            プロフィールを編集
          </button>
        </div>
        <EditProfile
          isOpen={isEditProfileModalOpen}
          onClose={handleCloseEditProfileModal}
          profile={profile}
        />
      </div>
    </div>
  );
}
