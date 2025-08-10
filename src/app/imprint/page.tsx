// src/app/imprint/page.tsx
export default function ImprintPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose dark:prose-invert">
        <h1>Imprint</h1>
        <p>Information provided according to Sec. 5 German Telemedia Act (TMG):</p>

        <h2>Website Operator (Service Provider):</h2>
        <ul>
          <li><strong>Name:</strong> Laszlo Szecsei</li>
          <li><strong>Address:</strong> Karcag, 5300</li>
          <li><strong>Contact (Email):</strong> criticalhun@proton.me</li>
          <li><strong>Company Registration Number:</strong> Not applicable (private individual)</li>
          <li><strong>VAT ID:</strong> Not applicable (private individual)</li>
        </ul>

        <h2>Hosting Provider Information:</h2>
        <ul>
          <li><strong>Name:</strong> Vercel Inc.</li>
          <li><strong>Address:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
          <li><strong>Contact (Email):</strong> privacy@vercel.com</li>
        </ul>
      </div>
    </main>
  );
}
