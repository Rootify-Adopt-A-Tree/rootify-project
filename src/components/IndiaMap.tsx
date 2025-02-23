"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { indiaStates } from '@/data/india-states';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons in Next.js
import L from 'leaflet';

// Fix Leaflet default marker icon issue
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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

interface IndiaMapProps {
  onLocationSelect: (location: LocationData) => void;
}

export default function IndiaMap({ onLocationSelect }: IndiaMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const properties = feature.properties;
    
    layer.on({
      click: () => {
        onLocationSelect({
          name: properties.name,
          coordinates: feature.geometry.coordinates[0][0],
          statistics: {
            forestCover: properties.forestCover || 20,
            barrenLand: properties.barrenLand || 15,
            agriculturalLand: properties.agriculturalLand || 45,
            temperature: properties.temperature || 25,
            rainfall: properties.rainfall || 1000,
            airQuality: properties.airQuality || 150
          }
        });
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 2,
          color: '#22C55E'
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 1,
          color: '#4B5563'
        });
      }
    });

    layer.bindTooltip(properties.name, {
      permanent: false,
      direction: 'center',
      className: 'bg-white px-2 py-1 rounded shadow'
    });
  };

  if (!mounted) return null;

  return (
    <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <GeoJSON
          data={indiaStates}
          style={() => ({
            fillColor: '#22C55E',
            fillOpacity: 0.5,
            weight: 1,
            color: '#4B5563'
          })}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
} 