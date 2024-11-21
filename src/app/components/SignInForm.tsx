"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SignInForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router= useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
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
        if (data.user) { // אם המשתמש קיים
          setError("User already exists. Please try logging in.");
          return; // עצירה של הביצוע
        }
      } else {
        setError("An error occurred while checking the user. Please try again.");
        return;
      }
  
      // אם המשתמש לא קיים - נרשום אותו
      const signUpRes = await fetch("/api/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      if (signUpRes.ok) {
        console.log("User signed in successfully");
  
        // איפוס השדות
        setName("");
        setEmail("");
        setPassword("");
        const result = await signUpRes.json();
        
        if (result.user) {
          const user = result.user; // חליצת אובייקט המשתמש בלבד
          console.log("Full response:", result);
          sessionStorage.setItem("user", JSON.stringify(user));
          router.push(`/pages/dashboard`);
        } else {
          console.error("User object not found in response.");
        }
        
        
      } else {
        setError("User sign-in failed. Please try again.");
      }
    } catch (err) {
      setError("Error during sign-in. Please try again later.");
      console.error(err);
    }
  };
  

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-lg p-6 rounded-lg border-t-4 border-green-400 max-w-md w-full bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            className="bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign In
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <div className="text-right mt-4">
            <Link className="text-sm text-blue-500 hover:underline" href="/">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
