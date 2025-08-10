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
        <p>When you register for an account using a third-party service like GitHub, we collect your name, email address, and profile picture. When you use the "Favorites" feature, we store the list of coins you have marked in our database, linked to your user account.</p>
        <p>The Site is hosted by Vercel Inc., which may collect technical data such as your IP address for analytics and security purposes.</p>

        {/* --- ÚJ RÉSZ ITT --- */}
        <h2>AI Assistant Data Usage</h2>
        <p>Our AI Assistant feature is powered by OpenAI's API. When you submit a question (a "prompt") to the assistant, the content of your prompt is sent to OpenAI's servers to generate a response. We do not store your questions or the AI's answers on our servers.</p>
        <p>Please be aware that OpenAI may use the data you provide to train their models. For more information, please review <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">OpenAI's Privacy Policy</a>.</p>
        <p><strong>We strongly advise you not to enter any sensitive personal or financial information into the AI chat.</strong></p>
        
        <h2>How We Use Your Personal Information</h2>
        <p>We use the information we collect to operate and maintain the features of the Site, such as providing you with access to your saved favorite coins. We do not sell or share your personal information with third parties, except as required to provide the service (e.g., sending prompts to OpenAI).</p>
      </div>
    </main>
  );
}