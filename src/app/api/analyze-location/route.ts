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
      Current Environmental Data:
      - Temperature: ${location.currentData.temperature}°C
      - Annual Rainfall: ${location.currentData.rainfall}mm
      - Air Quality Index: ${location.currentData.airQuality}
      - Forest Cover: ${location.currentData.forestCover}%
      - Carbon Level: ${location.currentData.carbonLevel} ppm

      Please provide a detailed analysis covering:
      1. Soil suitability and cultivation potential based on temperature and rainfall
      2. Urgency of tree planting in this area considering current forest cover
      3. Impact on local carbon levels and air quality
      4. Recommended native tree species for this location
      5. Expected environmental benefits and timeline
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an environmental expert specializing in reforestation and climate impact analysis. Focus on providing practical, actionable insights for tree planting initiatives."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
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