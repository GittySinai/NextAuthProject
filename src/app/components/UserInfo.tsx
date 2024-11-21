"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserData {
  name: string;
  email: string;
  source: string;
}

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const checkUserSource = () => {
      console.log("Initial session data:", session);

      let user: UserData | null = null;

      // בדיקת נתוני Google
      if (session?.user?.email && session?.user?.name) {
        console.log("Session-based user detected:", session.user);
        user = {
          name: session.user.name,
          email: session.user.email,
          source: "Google",
        };
      } else {
        // בדיקת נתונים מתוך sessionStorage
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          try {
            user = {
              ...JSON.parse(storedUser),
              source: "Custom Login",
            };
            console.log("User data from sessionStorage:", user);
          } catch (error) {
            console.error("Error parsing user data from sessionStorage:", error);
          }
        } else {
          console.warn("No user data found in sessionStorage.");
        }
      }

      // עדכון נתוני המשתמש
      if (user) {
        setUserData(user);
      }
    };

    checkUserSource();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "http://localhost:3000/",
    });
  };

  // הצגת מסך טעינה אם הנתונים עדיין לא נטענו
  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userData.name || "User"}</h1>
      <p className="text-lg text-gray-600 mb-4">Email: {userData.email}</p>
      <p className="text-lg text-gray-800 mb-4">Source: {userData.source}</p>
      <button
        onClick={handleSignOut}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300"
      >
        Sign Out
      </button>
    </div>
  );
}
