import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to Test Luna</h1>
      <div className={styles.buttonContainer}>
        <Link href="/auth/login">
          <button className={styles.button}>ログイン</button>
        </Link>
        <Link href="/auth/register">
          <button className={styles.button}>アカウント作成</button>
        </Link>
      </div>
    </main>
  );
}
