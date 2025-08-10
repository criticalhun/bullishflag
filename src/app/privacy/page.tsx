// src/app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
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

        <h2>How We Use Your Personal Information</h2>
        <p>We use the information we collect to operate and maintain the features of the Site, such as providing you with access to your saved favorite coins. We do not share your personal information with third parties.</p>

        {/* This is a basic template. For full GDPR compliance, a more detailed policy is recommended. */}
      </div>
    </main>
  );
}
