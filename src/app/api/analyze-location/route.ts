import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use server-side env variable
});

export async function POST(request: Request) {
  try {
    const location = await request.json();

    const prompt = `
      Analyze the following location for tree planting suitability:
      Location: ${location.name}
      
      Environmental Statistics:
      - Forest Cover: ${location.statistics.forestCover}%
      - Barren Land: ${location.statistics.barrenLand}%
      - Agricultural Land: ${location.statistics.agriculturalLand}%
      - Average Temperature: ${location.statistics.temperature}°C
      - Annual Rainfall: ${location.statistics.rainfall}mm
      - Air Quality Index: ${location.statistics.airQuality}

      Please provide a detailed analysis covering:
      1. Current environmental status and challenges
      2. Tree planting potential and recommended species
      3. Expected impact on local ecosystem
      4. Urgency level for reforestation
      5. Specific benefits to local community
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an environmental expert specializing in reforestation and climate impact analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return NextResponse.json({ 
      analysis: response.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error analyzing location:', error);
    return NextResponse.json(
      { error: 'Failed to analyze location' },
      { status: 500 }
    );
  }
} 