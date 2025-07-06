// src/components/ChatWithAI.tsx
'use client';

import { useState } from 'react';

export default function ChatWithAI() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const sendPrompt = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.message || 'Unknown error');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {/* ... textarea és gomb ... */}

      {error && <div className="mt-2 text-red-500">{error}</div>}
      {!error && !answer && !loading && <div className="mt-2">No response yet.</div>}

      {answer && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          {answer.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
