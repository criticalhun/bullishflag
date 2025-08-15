// src/app/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false, // Fontos: a hibakezeléshez false-ra kell állítani
      email,
      password,
    });

    // Itt kezeljük a NextAuth-tól kapott hibát
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      // Sikeres bejelentkezés esetén átirányítunk a főoldalra
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hibaüzenet megjelenítése */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <p className="text-sm text-center">
          Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}