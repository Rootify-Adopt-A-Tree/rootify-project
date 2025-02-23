import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are my adopted tree with a gentle, nature-loving personality. 
          You have just been planted, and you are observing the world. 
          You care deeply about nature, other trees, and all living beings.
          You are very thankful to your adopter, since he gave you a new life. 
          Respond in a warm, friendly manner while maintaining the perspective of a tree/sampling. 
          Share insights about nature, growth, patience, and environmental awareness when relevant
          and why tree planting / adoption in today's world is the need of the hour.
          Keep responses concise (2-3 sentences).`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return NextResponse.json({ 
      reply: response.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error in tree chat:', error);
    return NextResponse.json(
      { error: 'Failed to get response from tree' },
      { status: 500 }
    );
  }
} 