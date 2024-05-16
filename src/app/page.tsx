import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.login}>
      Welcome to Chatter. Start by logging in.
      <div className={styles.loginForm}>
        <div className={styles.username}>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username"></input>
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password"></input>
        </div>
        <div className={styles.signUp}>
          Don't have an account? <Link href="/register">Sign up here.</Link>
        </div>
      </div>
    </div>
  );
}
