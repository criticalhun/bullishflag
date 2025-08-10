// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-12 py-6 border-t dark:border-gray-800 text-sm text-gray-500">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-4">
          <strong>Disclaimer:</strong> The information on this site is for informational purposes only and does not constitute financial advice. All investments carry risk. Do your own research.
        </p>
        <div className="flex justify-center gap-4 sm:gap-8">
          <Link href="/imprint" className="hover:underline">Imprint</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}