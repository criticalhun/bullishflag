// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // vagy 'gpt-4o'
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const answer = response.data.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err) {
    let message = 'API error';
    if (err && typeof err === 'object' && 'message' in err) {
      message = (err as { message?: string }).message || message;
    }
    return NextResponse.json(
      { error: 'API error', message },
      { status: 500 }
    );
  }
}
