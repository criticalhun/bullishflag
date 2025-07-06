'use client';

import { useState } from 'react';

type NewsItem = {
  title: string;
  link: string;
  snippet?: string;
};

export default function ChatWithAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<NewsItem[] | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAI = async () => {
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.message || 'API error');
        setAnswer('');
      } else {
        setAnswer(data.answer);
      }
    } catch {
      setError('Network error');
      setAnswer('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-gray-100 dark:bg-gray-900 rounded-xl shadow p-4">
      <h2 className="font-bold text-lg mb-2">Chat with AI</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything about crypto, markets, or tech..."
          className="flex-1 border p-2 rounded dark:bg-black dark:border-gray-600"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askAI()}
          disabled={loading}
        />
        <button
          onClick={askAI}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Ask
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {!error && !answer && !loading && <div className="mt-2 text-gray-500">No headlines found.</div>}
      {loading && <div className="text-blue-500 mt-2">Thinking...</div>}

      {/* Válasz renderelése */}
      {!loading && answer && (
        <ul className="mt-3 space-y-2">
          {Array.isArray(answer)
            ? answer.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {item.title}
                  </a>
                  {item.snippet && (
                    <p className="text-sm text-gray-500">{item.snippet}</p>
                  )}
                </li>
              ))
            : answer
                .toString()
                .split('\n')
                .map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      )}
    </div>
  );
}
