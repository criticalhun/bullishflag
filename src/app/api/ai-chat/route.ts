// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    // --- HIBAKERESÉS ---
    // Kiírjuk a logba, hogy mit kapott a backend. Ezt a Vercel logokban láthatod.
    console.log('--- AI Chat Request ---');
    console.log('Prompt:', prompt);
    console.log('Context received:', context ? `Array with ${context.length} items` : 'null or undefined');
    // console.log('Context data:', JSON.stringify(context, null, 2)); // Ezt csak akkor vedd ki a kommentből, ha részletesen látni akarod a teljes adatot

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let systemMessage = `
      You are "BullishBot", an expert crypto market analyst for BullishFlag.xyz.
      Your primary goal is to analyze the real-time data provided to you.
      
      IMPORTANT: If the user's question can be answered from the "Current Top Coins Data", you MUST use that data and start your response with "Based on the data from the page...".
      
      If no data is provided in the context, or the question is general (e.g., "What is Bitcoin?"), answer from your general knowledge.
    `;

    // Ha kaptunk érvényes, nem üres kontextust, akkor azt is hozzáadjuk a rendszerüzenethez
    if (context && Array.isArray(context) && context.length > 0) {
      systemMessage += `

      Here is the Current Top Coins Data:
      ${JSON.stringify(context, null, 2)}
      `;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      max_tokens: 350,
      temperature: 0.5,
    });

    const answer = completion.choices[0].message.content;
    return NextResponse.json({ answer });

  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: 'API Error', message }, { status: 500 });
  }
}