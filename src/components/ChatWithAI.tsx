// src/components/ChatWithAI.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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
  const [isCopied, setIsCopied] = useState(false);

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
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (answer) {
      navigator.clipboard.writeText(answer).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
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
      
      {/* --- JAVÍTÁS ITT: A válasz doboza Flexbox-szal --- */}
      {answer && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded">
          <div className="flex justify-between items-start gap-4">
            {/* 1. oszlop: A szöveg, ami kitölti a teret */}
            <p className="whitespace-pre-wrap flex-grow">{answer}</p>
            
            {/* 2. oszlop: A gomb, fix mérettel */}
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}