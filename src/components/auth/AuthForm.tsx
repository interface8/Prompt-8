"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type AuthFormProps = {
  type: "signin" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const isSignIn = type === "signin";
  const { loading, error, handleAuth } = useAuth(type);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSignIn && (
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded border dark:bg-gray-100 bg-white text-sm"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded border dark:bg-gray-100 bg-white text-sm"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded border dark:bg-gray-100 bg-white text-sm"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 rounded bg-blue-600 text-white text-sm"
      >
        {loading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}
      </button>
      {isSignIn && (
        <button
          type="button"
          onClick={() => handleAuth(form, "google")}
          className="w-full bg-gray-100 text-sm border mt-2 p-3 rounded hover:bg-gray-200"
        >
          Sign in with Google
        </button>
      )}
      <p className="text-sm text-center mt-2">
        {isSignIn ? "No account?" : "Already registered?"}{" "}
        <Link
          href={isSignIn ? "/auth/signup" : "/auth/signin"}
          className="text-blue-600 hover:underline"
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
