// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchWeb } from '@/lib/searchWeb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // lépés: chat completion function calling
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',    // vagy gpt-3.5-turbo-0613
    messages: [
      { role: 'system', content: 'You are CryptoBot, expert in crypto markets.' },
      { role: 'user', content: prompt },
    ],
    functions: [
      {
        name: 'searchWeb',
        description: 'Perform a web search and return concise snippets.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
    ],
    function_call: { name: 'searchWeb' },
  });

  // A modell hívja a függvényt:
  if (completion.choices[0].message.function_call) {
    const args = JSON.parse(completion.choices[0].message.function_call.arguments);
    const results = await searchWeb(args.query);

    // Másodszor: megkérdezzük a modellt, hogy a search eredmények alapján adja a végleges választ
    const followUp = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are CryptoBot, expert in crypto markets.' },
        { role: 'user', content: prompt },
        {
          role: 'function',
          name: 'searchWeb',
          content: JSON.stringify(results),
        },
      ],
    });

    return NextResponse.json({ answer: followUp.choices[0].message.content });
  }

  // Ha nem hívott függvényt, simán adja vissza az első választ
  return NextResponse.json({ answer: completion.choices[0].message.content });
}
