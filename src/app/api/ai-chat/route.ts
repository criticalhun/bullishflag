// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchCoinDetails } from '@/lib/coinApi';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are "BullishBot", an expert crypto market analyst. 
        Your goal is to provide clear, well-structured answers.
        **Format all your responses using Markdown.**
        Use lists, bold text, italics, and tables where appropriate to improve readability.
        When analyzing data, present it clearly. For comparisons, a table is often best.
        
        Current Top Coins Context (use this if the user asks about top performers):
        ${JSON.stringify(context, null, 2)}`
      },
      { role: 'user', content: prompt }
    ];

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      // ... (a get_current_price tool definíciója változatlan)
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
      messages.push(responseMessage);
      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'get_current_price') {
          const args = JSON.parse(toolCall.function.arguments);
          const coinData = await fetchCoinDetails(args.symbol);
          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: 'get_current_price',
            content: JSON.stringify(coinData)
          });
        }
      }
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
      });
      return NextResponse.json({ answer: finalResponse.choices[0].message.content });
    }

    return NextResponse.json({ answer: responseMessage.content });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}