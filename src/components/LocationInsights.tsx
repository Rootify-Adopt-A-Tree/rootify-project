import { useState } from 'react';

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

interface LocationInsightsProps {
  location: LocationData;
  aiInsights: string | null;
  loading: boolean;
}

export function LocationInsights({ location, aiInsights, loading }: LocationInsightsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{location.name}</h2>
        <p className="text-sm text-gray-500">
          Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
        </p>
      </div>

      {/* Current Environmental Data */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Temperature</p>
          <p className="text-lg font-semibold text-gray-800">
            {location.currentData.temperature}°C
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Rainfall</p>
          <p className="text-lg font-semibold text-gray-800">
            {location.currentData.rainfall}mm
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Air Quality</p>
          <p className="text-lg font-semibold text-gray-800">
            {location.currentData.airQuality}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Carbon Level</p>
          <p className="text-lg font-semibold text-gray-800">
            {location.currentData.carbonLevel} ppm
          </p>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Analysis</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : aiInsights ? (
          <div className="prose prose-sm max-w-none">
            {aiInsights.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Select a location to view AI analysis</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          Start Planting Project
        </button>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Connect with Local NGOs
        </button>
      </div>
    </div>
  );
} 