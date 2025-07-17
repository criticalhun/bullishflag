// src/components/LoginButton.tsx
'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();

  // Ha a felhasználó be van jelentkezve, a kijelentkezés gomb jelenik meg
  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.name && <span className="text-sm hidden sm:block">{session.user.name}</span>}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Ha a felhasználó nincs bejelentkezve, egy linket mutatunk a bejelentkezési oldalra
  return (
    <Link 
      href="/signin" 
      className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white"
    >
      Sign In
    </Link>
  );
}