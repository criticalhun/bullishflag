'use client';
import { useState } from 'react';

export default function AskAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    setAnswer('');
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question }),
    });
    const data = await res.json();
    setAnswer(data.answer || data.message || 'No answer');
    setLoading(false);
  };

  return (
    <div className="my-8 p-4 rounded bg-gray-100 dark:bg-gray-800 max-w-2xl mx-auto">
      <h2 className="font-bold text-lg mb-2">Chat with AI</h2>
      <input
        className="w-full p-2 border rounded mb-2 dark:bg-black dark:border-gray-700"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask anything about crypto, markets, or tech..."
      />
      <button
        onClick={askAI}
        disabled={loading || !question}
        className="ml-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:bg-gray-400"
      >
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {answer && (
        <div className="mt-4 p-2 rounded bg-white dark:bg-gray-900 border dark:border-gray-700">
          <strong>AI:</strong> {answer}
        </div>
      )}
    </div>
  );
}
