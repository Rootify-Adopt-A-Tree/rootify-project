import { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  statistics: {
    forestCover: number;
    barrenLand: number;
    agriculturalLand: number;
    temperature: number;
    rainfall: number;
    airQuality: number;
  };
}

interface LocationInsightsProps {
  location: LocationData;
  aiInsights: string | null;
  loading: boolean;
}

export function LocationInsights({ location, aiInsights, loading }: LocationInsightsProps) {
  // Land distribution chart data
  const landDistributionData = {
    labels: ['Forest Cover', 'Barren Land', 'Agricultural Land'],
    datasets: [
      {
        data: [
          location.statistics.forestCover,
          location.statistics.barrenLand,
          location.statistics.agriculturalLand,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // green
          'rgba(234, 179, 8, 0.8)',  // yellow
          'rgba(168, 85, 247, 0.8)', // purple
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Environmental metrics chart data
  const environmentalMetricsData = {
    labels: ['Temperature (°C)', 'Rainfall (cm)', 'Air Quality Index'],
    datasets: [
      {
        label: 'Environmental Metrics',
        data: [
          location.statistics.temperature,
          location.statistics.rainfall / 100, // Convert to cm
          location.statistics.airQuality,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">{location.name}</h2>
        
        {/* Land Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Land Distribution</h3>
          <div className="h-64">
            <Doughnut data={landDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Environmental Metrics Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Environmental Metrics</h3>
          <div className="h-64">
            <Bar data={environmentalMetricsData} options={chartOptions} />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Forest Cover</p>
            <p className="text-2xl font-bold text-green-600">{location.statistics.forestCover}%</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Barren Land</p>
            <p className="text-2xl font-bold text-red-600">{location.statistics.barrenLand}%</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Temperature</span>
            <span className="font-medium">{location.statistics.temperature}°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Annual Rainfall</span>
            <span className="font-medium">{location.statistics.rainfall} mm</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Air Quality Index</span>
            <span className="font-medium">{location.statistics.airQuality}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-800 mb-4">AI Analysis</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : aiInsights ? (
          <div className="prose prose-green">
            {aiInsights.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-600">{paragraph}</p>
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