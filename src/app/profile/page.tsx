// src/app/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Ha a betöltés befejeződött és a felhasználó nincs bejelentkezve,
    // átirányítjuk a bejelentkezési oldalra.
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Amíg tölt a session, egy üzenetet mutatunk
  if (status === 'loading') {
    return <p className="text-center p-10">Loading...</p>;
  }

  // Ha a felhasználó be van jelentkezve, megjelenítjük a profilját
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
       <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Main Page
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        {session?.user ? (
          <div className="space-y-4">
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Name:</strong> {session.user.name || 'Not provided'}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
            // Ez a rész csak akkor jelenik meg, ha valami hiba történik
           <p>Could not load user data.</p>
        )}
      </div>
    </main>
  );
}
