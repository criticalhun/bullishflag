// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchCoinDetails } from '@/lib/coinApi'; // Az új, központi függvényünk

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are "BullishBot", an expert crypto market analyst for BullishFlag.xyz. 
        1. If the user asks about top performers, summaries, or comparisons, use the provided "Current Top Coins Context".
        2. If the user asks for the price of a specific coin, use the 'get_current_price' tool.
        3. For general questions, use your own knowledge.
        
        Current Top Coins Context:
        ${JSON.stringify(context, null, 2)}`
      },
      { role: 'user', content: prompt }
    ];

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_price',
          description: 'Get the current price and market data for a specific cryptocurrency symbol.',
          parameters: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The cryptocurrency symbol, e.g., "BTC", "ETH", "SOL".'
              },
            },
            required: ['symbol'],
          },
        },
      },
    ];

    // 1. Első API hívás: az AI eldönti, kell-e neki szerszám
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    // 2. Ha az AI szerszámot akar használni
    if (toolCalls) {
      messages.push(responseMessage); // Hozzáadjuk az AI válaszát (a szerszámhívást) a beszélgetéshez

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        if (functionName === 'get_current_price') {
          const args = JSON.parse(toolCall.function.arguments);
          const coinData = await fetchCoinDetails(args.symbol);
          
          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: JSON.stringify(coinData)
          });
        }
      }

      // 3. Második API hívás: elküldjük a szerszám eredményét, hogy az AI válaszoljon
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
      });

      return NextResponse.json({ answer: finalResponse.choices[0].message.content });
    }

    // Ha az AI nem használt szerszámot, visszaadjuk az eredeti választ
    return NextResponse.json({ answer: responseMessage.content });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}