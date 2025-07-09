// src/components/ChatWithAI.tsx
'use client';

import { useState } from 'react';

// Definiáljuk a Coin típusát, hogy a komponens tudja, mit kap
type Coin = {
  name: string;
  symbol: string;
};

interface ChatWithAIProps {
  topCoins: Coin[];
}

export default function ChatWithAI({ topCoins }: ChatWithAIProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isContextReady = topCoins && topCoins.length > 0;

  const handleAsk = async () => {
    if (!question.trim() || !isContextReady) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question, context: topCoins }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.message || 'An error occurred.');
      } else {
        setAnswer(data.answer);
      }
    } catch { // --- JAVÍTÁS ITT: a '(err)' el lett távolítva ---
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-4 border rounded-xl bg-gray-100 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-center">Smart AI Assistant</h2>
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 disabled:opacity-50"
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={isContextReady ? "Ask about the top performers..." : "Loading context data..."}
        disabled={loading || !isContextReady}
      />
      <button
        onClick={handleAsk}
        disabled={loading || !question.trim() || !isContextReady}
        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>

      {loading && <div className="mt-4 text-center text-blue-500">Analyzing...</div>}
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}
      {answer && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded">
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}