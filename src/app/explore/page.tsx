"use client";

import { useState } from 'react';
import IndiaMap from '@/components/IndiaMap';
import { LocationInsights } from '@/components/LocationInsights';
import { analyzeLocation } from '@/lib/ai-analysis';
import Header from '@/components/Header';

interface LocationData {
  name: string;
  coordinates: [number, number];
  currentData: {
    temperature: number;
    rainfall: number;
    airQuality: number;
    forestCover: number;
    carbonLevel: number;
  };
}

export default function ExplorePage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const handleLocationSelect = async (location: LocationData) => {
    setSelectedLocation(location);
    setLoading(true);

    try {
      const insights = await analyzeLocation(location);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error analyzing location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Explore Planting Locations</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <IndiaMap onLocationSelect={handleLocationSelect} />
          </div>

          {/* Insights Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedLocation ? (
              <LocationInsights
                location={selectedLocation}
                aiInsights={aiInsights}
                loading={loading}
              />
            ) : (
              <div className="text-center text-gray-500">
                <p>Select a location on the map to view environmental insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 