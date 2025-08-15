// src/components/LoginButton.tsx
'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();

  // Ha a felhasználó be van jelentkezve
  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        {/* A felhasználó neve most már egy link a profil oldalra */}
        {session.user.name && (
          <Link href="/profile" className="text-sm hidden sm:block hover:underline">
            {session.user.name}
          </Link>
        )}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Ha a felhasználó nincs bejelentkezve
  return (
    <Link 
      href="/signin" 
      className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white"
    >
      Sign In
    </Link>
  );
}