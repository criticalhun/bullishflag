'use client';

import React, { useState } from 'react';

type Result = {
  title: string;
  link: string;
  snippet?: string;
};

export default function ChatWithAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Result[] | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer('');

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unexpected error');
      }

      if (
        (!Array.isArray(data.answer) && !data.answer) ||
        (Array.isArray(data.answer) && data.answer.length === 0)
      ) {
        setError('No headlines found.');
        setAnswer('');
      } else {
        setAnswer(data.answer);
      }
    } catch (err) {
      setError('Sorry, there was an error processing your request.');
      setAnswer('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black border dark:border-gray-700 rounded-2xl shadow-xl p-4 mt-12 max-w-2xl mx-auto">
      <h2 className="font-bold text-lg mb-2">Chat with AI</h2>
      <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded dark:bg-black dark:border-gray-600"
          placeholder="Ask anything about crypto, markets, or tech..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      <div className="min-h-[48px] mt-2">
        {loading && <div className="text-blue-500">Thinking...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!error && !loading && !answer && (
          <div className="text-gray-500">No headlines found.</div>
        )}
        {!error && !loading && answer && (
          <ul className="list-decimal pl-6 space-y-3">
            {Array.isArray(answer)
              ? answer.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                    {item.snippet && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.snippet}
                      </p>
                    )}
                  </li>
                ))
              : answer
                  .split('\n')
                  .filter(Boolean)
                  .map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
