"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LatLngTuple } from 'leaflet';
import { Search, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { indiaStates } from '@/data/india-states';
import { landUseData } from '@/data/land-use';

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
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
}

interface IndiaMapProps {
  onLocationSelect: (location: LocationData) => void;
}

const LAND_TYPES = [
  { type: 'barren', label: 'Barren Land', color: '#FCA5A5' },
  { type: 'forest', label: 'Forest Cover', color: '#059669' },
  { type: 'agricultural', label: 'Agricultural Land', color: '#FBBF24' },
  { type: 'urban', label: 'Urban Areas', color: '#6B7280' }
];

const CENTER_POSITION: LatLngTuple = [20.5937, 78.9629];
const ZOOM_LEVEL = 5;

interface SearchResult {
  name: string;
  type: 'state' | 'district' | 'locality';
  coordinates: LatLngTuple;
}

interface AreaData {
  name: string;
  type: 'district' | 'locality';
  coordinates: LatLngTuple;
  forestCover: number;
  barrenLand: number;
  agriculturalLand: number;
  suitableForPlanting: boolean;
  soilType: string;
  rainfall: number;
  nearbyNGOs: string[];
}

// Add district and locality data
const areaData: Record<string, AreaData[]> = {
  "Maharashtra": [
    {
      name: "Pune District",
      type: "district",
      coordinates: [18.5204, 73.8567],
      forestCover: 12.5,
      barrenLand: 15.3,
      agriculturalLand: 55.2,
      suitableForPlanting: true,
      soilType: "Black Cotton Soil",
      rainfall: 722,
      nearbyNGOs: ["Green Earth Foundation", "Tree Planters Co-op"]
    },
    {
      name: "Hadapsar",
      type: "locality",
      coordinates: [18.5089, 73.9259],
      forestCover: 8.2,
      barrenLand: 20.1,
      agriculturalLand: 45.7,
      suitableForPlanting: true,
      soilType: "Black Soil",
      rainfall: 700,
      nearbyNGOs: ["Local Green Initiative"]
    }
    // Add more districts and localities
  ]
};

export default function IndiaMap({ onLocationSelect }: IndiaMapProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(CENTER_POSITION);
  const [mapZoom, setMapZoom] = useState(ZOOM_LEVEL);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [showAreaDetails, setShowAreaDetails] = useState(false);

  // Filter options
  const filterOptions = [
    { id: 'barren', label: 'Barren Land', color: '#FCA5A5' },
    { id: 'forest', label: 'Forest Areas', color: '#059669' },
    { id: 'agricultural', label: 'Agricultural Land', color: '#FBBF24' },
    { id: 'urban', label: 'Urban Areas', color: '#6B7280' },
    { id: 'planting', label: 'Planting Projects', color: '#3B82F6' },
  ];

  // Enhanced search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const results: SearchResult[] = [];

    // Search in districts and localities
    Object.values(areaData).flat().forEach(area => {
      if (area.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({
          name: area.name,
          type: area.type,
          coordinates: area.coordinates
        });
      }
    });

    return results;
  }, [searchQuery]);

  // Handle area selection
  const handleAreaSelect = (area: AreaData) => {
    setSelectedArea(area);
    setShowAreaDetails(true);
    setMapCenter(area.coordinates);
    setMapZoom(area.type === 'district' ? 10 : 13);
  };

  const handleStateClick = (feature: any) => {
    if (!feature || !feature.geometry || !feature.geometry.coordinates) {
      console.error('Invalid feature data:', feature);
      return;
    }

    try {
      // Handle both single polygon and multi-polygon cases
      let coordinates = feature.geometry.coordinates;
      if (Array.isArray(coordinates[0][0][0])) {
        // Multi-polygon case - take the first polygon
        coordinates = coordinates[0];
      }

      // Calculate center point
      const center = coordinates.reduce(
        (acc: number[], curr: number[]) => [
          acc[0] + curr[0] / coordinates.length,
          acc[1] + curr[1] / coordinates.length
        ],
        [0, 0]
      );

      onLocationSelect({
        name: feature.properties?.name || 'Unknown Location',
        coordinates: [center[1], center[0]], // Leaflet uses [lat, lng]
        currentData: {
          temperature: 25, // Example data
          rainfall: 722,
          airQuality: 50,
          forestCover: feature.properties?.forestCover || 0,
          carbonLevel: 400
        }
      });
    } catch (error) {
      console.error('Error processing feature:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[600px] bg-gray-50">
      {/* Enhanced Search Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district or locality..."
            className="w-72 px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border p-2 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const area = Object.values(areaData)
                      .flat()
                      .find(a => a.name === result.name);
                    if (area) handleAreaSelect(area);
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{result.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({result.type})</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {result.type === 'district' ? 'District' : 'Locality'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Area Details Panel */}
      {showAreaDetails && selectedArea && (
        <div className="absolute top-20 left-4 z-[1000] bg-white rounded-lg shadow-lg border p-6 w-80">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{selectedArea.name}</h3>
            <button
              onClick={() => setShowAreaDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-green-800 font-medium">{selectedArea.forestCover}%</p>
                <p className="text-gray-600">Forest Cover</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-800 font-medium">{selectedArea.barrenLand}%</p>
                <p className="text-gray-600">Barren Land</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Planting Suitability</h4>
              <div className="space-y-2 text-sm">
                <p>Soil Type: {selectedArea.soilType}</p>
                <p>Annual Rainfall: {selectedArea.rainfall} mm</p>
                <p className={selectedArea.suitableForPlanting ? 'text-green-600' : 'text-red-600'}>
                  {selectedArea.suitableForPlanting ? '✓ Suitable for planting' : '× Not suitable for planting'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Nearby NGOs</h4>
              <div className="space-y-2">
                {selectedArea.nearbyNGOs.map((ngo, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                    {ngo}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {/* Handle planting request */}}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mt-4"
            >
              Plant Trees Here
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="w-64 px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border p-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleAreaSelect(result as AreaData)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                >
                  <span className="font-medium">{result.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({result.type})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-16 left-4 z-[1000] bg-white rounded-lg shadow-lg border p-4 w-64">
          <h4 className="font-medium mb-3">Filter by Land Type</h4>
          <div className="space-y-2">
            {filterOptions.map(filter => (
              <label key={filter.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={(e) => {
                    setSelectedFilters(
                      e.target.checked
                        ? [...selectedFilters, filter.id]
                        : selectedFilters.filter(f => f !== filter.id)
                    );
                  }}
                  className="rounded text-green-600"
                />
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: filter.color }}
                  />
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Map Container with proper z-index */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <MapContainer
          center={CENTER_POSITION}
          zoom={ZOOM_LEVEL}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <GeoJSON
            data={indiaStates}
            style={{
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.3,
              fillColor: '#10B981'
            }}
            eventHandlers={{
              click: (e: any) => {
                if (e.target && e.target.feature) {
                  handleStateClick(e.target.feature);
                }
              },
              mouseover: (e: any) => {
                const layer = e.target;
                if (layer) {
                  layer.setStyle({
                    fillOpacity: 0.7
                  });
                }
              },
              mouseout: (e: any) => {
                const layer = e.target;
                if (layer) {
                  layer.setStyle({
                    fillOpacity: 0.3
                  });
                }
              }
            }}
          />
        </MapContainer>
      </div>

      {/* Legends with higher z-index */}
      <div className="absolute top-4 right-4" style={{ zIndex: 1000 }}>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Land Classification
          </h3>
          <div className="space-y-3">
            {LAND_TYPES.map(({ type, label, color }) => (
              <div key={type} className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                />
                <span className="text-gray-700 font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            Click on any state for details
          </div>
        </div>
      </div>

      {/* Statistics panel with higher z-index */}
      <div className="absolute bottom-4 left-4" style={{ zIndex: 1000 }}>
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <h4 className="font-semibold text-gray-800 mb-2">National Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Forest Cover:</span>
              <span className="font-medium text-green-600">21.67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Barren Land:</span>
              <span className="font-medium text-red-600">17.98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Agricultural Land:</span>
              <span className="font-medium text-yellow-600">60.35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLandUseColor(type: string): string {
  const landType = LAND_TYPES.find(t => t.type === type);
  return landType?.color || '#E5E7EB';
} 