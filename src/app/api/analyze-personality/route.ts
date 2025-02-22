import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

const AVAILABLE_TREES = [
  "Ashoka", "Cedar", "Sunflower", "Cactus", "Chamomile",
  "Peepal", "Neem", "Almond", "Papaya", "Apple", "Jasmine", "Lemon"
];

export async function POST(request: Request) {
  try {
    const { traits } = await request.json();

    const prompt = `
      Based on the following personality traits: ${traits.join(', ')}
      
      Choose the most suitable tree from this list that matches the personality:
      ${AVAILABLE_TREES.join(', ')}

      Consider the following:
      - The symbolism and characteristics of each tree
      - How the tree's properties align with the personality traits
      - The overall personality pattern shown in the traits

      Provide a response in JSON format with two fields:
      1. "tree": The name of the chosen tree
      2. "description": A 2-3 sentence explanation of why this tree matches their personality

      The description should be personal, inspiring, and connect the tree's characteristics to their personality traits.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in both personality analysis and tree symbolism, providing insightful connections between human traits and tree characteristics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in personality analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze personality' },
      { status: 500 }
    );
  }
} 