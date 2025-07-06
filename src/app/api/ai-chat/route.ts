// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI, { ChatCompletionRequestMessage } from 'openai';
import { searchWeb } from '@/lib/searchWeb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Explicit típusmegadás:
const systemMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content: `
You are CryptoBot, an AI assistant specialized in cryptocurrencies.
When asked for “news headlines,” you must return exactly the titles of the top web search results,
each as its own bullet or numbered item, without extra commentary or raw price stats.
  `.trim(),
};

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // 1) Első kör: user prompt + function definíció
  const initial = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      systemMessage,                    // most már jól típusozott
      { role: 'user', content: prompt },
    ],
    functions: [
      {
        name: 'searchWeb',
        description: 'Retrieve live web search snippets',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
      },
    ],
    function_call: 'auto',
  });

  const msg = initial.choices[0].message;

  if (msg.function_call) {
    const { query } = JSON.parse(msg.function_call.arguments);
    const results = await searchWeb(query);

    // 2) Második kör: visszaküldjük az eredményeket
    const followUp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage,                   // ide is ugyanaz a típus
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

  // 3) Ha nem hívott functiont, simán visszaadjuk a content-et
  return NextResponse.json({ answer: msg.content });
}
