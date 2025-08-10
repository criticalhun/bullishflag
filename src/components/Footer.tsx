// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-12 py-4 border-t dark:border-gray-800 text-center text-sm text-gray-500">
      <div className="max-w-6xl mx-auto flex justify-center gap-4 sm:gap-8">
        <Link href="/imprint" className="hover:underline">Imprint</Link>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
      </div>
    </footer>
  );
}
