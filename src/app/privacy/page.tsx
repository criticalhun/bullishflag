// src/app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Main Page
        </Link>
      </div>
      <div className="prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use BullishFlag.xyz (the "Site").</p>
        
        <h2>Data Controller</h2>
        <ul>
          <li><strong>Name:</strong> Laszlo Szecsei</li>
          <li><strong>Contact (Email):</strong> criticalhun@proton.me</li>
        </ul>

        <h2>Personal Information We Collect</h2>
        <p>When you register for an account, we collect certain information from you, including your name, email address, and profile picture (if provided via a third-party service like GitHub). When you use the "Favorites" feature, we store the list of coins you have marked.</p>
        <p>The Site is hosted by Vercel Inc., which may collect technical data such as your IP address for analytics and security purposes. For more information, please see Vercel's privacy policy.</p>

        <h2>AI Assistant Data Usage</h2>
        <p>Our AI Assistant feature is powered by OpenAI's API. When you submit a question (a "prompt") to the assistant, the content of your prompt is sent to OpenAI's servers to generate a response. We do not store your questions or the AI's answers on our servers.</p>
        <p><strong>We strongly advise you not to enter any sensitive personal or financial information into the AI chat.</strong></p>
        
        <h2>How We Use Your Personal Information</h2>
        <p>We use the information we collect to operate and maintain the features of the Site, such as providing you with access to your saved favorite coins. We do not sell or share your personal information with third parties, except as required to provide the service (e.g., sending prompts to OpenAI).</p>
      </div>
    </main>
  );
}