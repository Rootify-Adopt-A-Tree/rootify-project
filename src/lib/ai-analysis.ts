interface LocationData {
  name: string;
  coordinates: [number, number];
  statistics: {
    forestCover: number;
    barrenLand: number;
    agriculturalLand: number;
    temperature: number;
    rainfall: number;
    airQuality: number;
  };
}

export async function analyzeLocation(location: LocationData): Promise<string> {
  try {
    const response = await fetch('/api/analyze-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze location');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
} 