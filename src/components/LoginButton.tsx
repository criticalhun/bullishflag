// src/components/LoginButton.tsx
'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()} className="px-3 py-1 rounded-md bg-red-600 text-white">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <p>Not signed in</p>
      <button onClick={() => signIn("github")} className="px-3 py-1 rounded-md bg-green-600 text-white">
        Sign in with GitHub
      </button>
    </div>
  );
}
