"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';

export default function Home() {
  const [user, setUser] = useState<{ email: string; username: string }>();

  useEffect(() => {
    const cookies = parse(document.cookie);

    if (cookies.user) {
      setUser(JSON.parse(cookies.user));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};
