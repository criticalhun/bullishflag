'use client';

import { useState } from 'react';

export default function ChatWithAI() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAnswer('');
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setLoading(false);
    if (data.answer) setAnswer(data.answer);
    else setAnswer(data.error || 'Error.');
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4 border rounded shadow bg-white dark:bg-black">
      <h2 className="text-lg font-bold mb-2">Chat with AI</h2>
      <textarea
        className="w-full p-2 border rounded mb-2 dark:bg-black dark:text-white"
        rows={3}
        placeholder="Ask anything about crypto, markets, or tech..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-blue-300"
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <b>AI:</b> {answer}
        </div>
      )}
    </div>
  );
}
