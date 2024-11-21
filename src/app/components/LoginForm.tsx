"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are necessary.");
      return;
    }
    setError(""); // איפוס שגיאות אם הכל תקין

    try {
      const res = await fetch("/api/userExist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // המשתמש קיים
          console.log("User exists. Redirecting...");
          console.log(data.user);

          setError("");
          router.push("/pages/dashboard"); // מפנה לדף המשתמש
          return;
        } else {
          setError("User not found. Please sign in first.");
          return; // עצירה של הביצוע אם המשתמש לא קיים
        }
      } else {
        setError("An error occurred while checking the user. Please try again.");
        return;
      }
    } catch (err) {
      setError("Error during login. Please try again later.");
      console.error(err);
    }
  };
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/pages/dashboard" })
  
   }; 
  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-lg p-6 rounded-lg border-t-4 border-green-400 max-w-md w-full bg-white">
        <h1 className="text-xl font-bold my-4 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
 <button
  type="button"
  onClick={handleGoogleSignIn}
  className="mt-2 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
>
  Sign in with Google
</button>
          <div className="text-right">
            <Link
              className="text-sm text-blue-500 hover:underline"
              href="/pages/signIn"
            >
              Don't you have an account? <span className="underline">Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
