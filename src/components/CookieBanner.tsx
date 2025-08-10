// src/components/CookieBanner.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 p-4 border-t dark:border-gray-800 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This site uses cookies to enhance your experience.
          <Link href="/cookies" className="underline ml-1">Learn more</Link>.
        </p>
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
