import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <div className="loginContainer">
      <div className='welcome'> Welcome to Chatter.</div>
      <div className='welcome' style={{ marginBottom: "2.5rem" }}>
        Start by logging in.
      </div>

      <div className="loginForm">
        <input
          type="text"
          id="username"
          placeholder="Email"
          className="loginUsername"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="loginPassword"
        />
        <button className="login">Log in</button>
        <div className="registerHere">
          Don't have an account? <Link href="/register">Sign up here.</Link>
        </div>
      </div>
    </div>
  );
}
