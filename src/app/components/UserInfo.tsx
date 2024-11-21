"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "http://localhost:3000/", // מפנה את המשתמש לכתובת localhost:3000
    });
  };

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
