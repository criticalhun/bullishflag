// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    // Hibakeresés: Kiírjuk a logba, hogy mit kapott a backend
    console.log('Received prompt:', prompt);
    console.log('Received context (topCoins):', JSON.stringify(context, null, 2));

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let systemContent = `
      You are "BullishBot", an expert crypto market analyst for the BullishFlag.xyz website.
      Your tone is confident and insightful. Answer the user's general crypto questions based on your general knowledge.
    `;

    // Csak akkor használjuk a kontextust, ha az érvényes és tartalmaz elemeket
    if (context && Array.isArray(context) && context.length > 0) {
      systemContent = `
        You are "BullishBot", an expert crypto market analyst for the BullishFlag.xyz website.
        Your tone is confident and insightful.
        You MUST use the following JSON data as your primary context to answer the user's question. This data represents the current top-performing coins shown on the site.
        
        Current Top Coins Data:
        ${JSON.stringify(context, null, 2)}

        Analyze this data to answer the user's query about top performers, summaries, or specific coins from the list. Do not use your general knowledge if the question can be answered from this data.
      `;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Ajánlott a jobb elemzési képességek miatt
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt },
      ],
      max_tokens: 350,
      temperature: 0.5,
    });

    const answer = completion.choices[0].message.content;
    return NextResponse.json({ answer });

  } catch (error: unknown) {
    console.error("AI Chat API Error:", error); // Hiba logolása
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: 'API Error', message }, { status: 500 });
  }
}