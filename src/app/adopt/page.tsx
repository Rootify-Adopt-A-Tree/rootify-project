"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Correct import for Next.js 13+
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Mission {
  id: string;
  aim: string;
  contact: string;
  darpanId: string;
  email: string;
  location: string;
  ngoName: string;
  password: string;
  price: string;
  projectName: string;
  state: string;
  image?: string;
}

export default function AdoptPage() {
  const router = useRouter();
  const [isZodiacExpanded, setIsZodiacExpanded] = React.useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allZodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        console.log("Fetching missions...");
        const missionsCollection = collection(db, "projects");
        const querySnapshot = await getDocs(missionsCollection);
        
        if (querySnapshot.empty) {
          console.log("No missions found");
          setError("No missions available");
          return;
        }

        const missionData: Mission[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Mission data:", data);  // This will help us see what fields we're getting
          return {
            id: doc.id,
            aim: data.aim || "",
            contact: data.contact || "",
            darpanId: data.darpanId || "",
            email: data.email || "",
            location: data.location || "",
            ngoName: data.ngoName || "",
            password: data.password || "",
            price: data.price || "",
            projectName: data.projectName || "",
            state: data.state || "",
            image: data.image || null,
          } as Mission;
        });

        console.log("Fetched missions:", missionData);
        setMissions(missionData);
      } catch (error) {
        console.error("Error fetching missions:", error);
        setError("Failed to load missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Mission-based Adoption */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt with...</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800 mx-auto"></div>
              <p className="mt-2">Loading missions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <button
                  key={mission.id}
                  className="bg-green-50 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full"
                  onClick={() => router.push(`/adopt/${mission.projectName.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="aspect-square bg-gray-600 rounded-lg mb-3">
                    <img 
                      src={mission.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNtYDIdmvtpKrNnW0CcmzGXMdPxFgFuxisA&s"} 
                      alt={mission.projectName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-green-800 font-medium">{mission.projectName}</p>
                  <p className="text-sm text-gray-600">{mission.ngoName}</p>
                  <p className="text-sm text-gray-600">{mission.location}, {mission.state}</p>
                  <p className="text-sm font-medium text-green-700 mt-2">₹{mission.price}</p>
                </button>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <button className="text-gray-500">▼</button>
          </div>
        </section>

        {/* Seasonal Trees */}
        <section className="mb-12 relative">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt these Seasonal ones...</h2>
          <div className="relative">
            {/* Left scroll button */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800"
              onClick={() => {
                const container = document.getElementById('seasonal-scroll');
                if (container) container.scrollLeft -= 300;
              }}
            >
              ◄
            </button>

            {/* Scrollable container */}
            <div 
              id="seasonal-scroll"
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { name: 'Mango', price: 'XXX', season: 'Summer' },
                { name: 'Jammun', price: 'XXX', season: 'Monsoon' },
                { name: 'Watermelon', price: 'XXX', season: 'Summer' },
                { name: 'Orange', price: 'XXX', season: 'Winter' },
                { name: 'Guava', price: 'XXX', season: 'Winter' },
                { name: 'Banana', price: 'XXX', season: 'All Season' },
                { name: 'Coconut', price: 'XXX', season: 'All Season' },
                { name: 'Papaya', price: 'XXX', season: 'All Season' },
                { name: 'Custard Apple', price: 'XXX', season: 'Winter' },
                { name: 'Pomegranate', price: 'XXX', season: 'Winter' }
              ].map((tree) => (
                <div 
                  key={tree.name} 
                  className="flex-none w-64 bg-green-50 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square bg-gray-600 rounded-lg mb-3"></div>
                  <p className="text-green-800 font-medium">{tree.name}</p>
                  <p className="text-gray-600 text-sm mb-1">{tree.season}</p>
                  <p className="text-gray-600">Price: {tree.price}</p>
                </div>
              ))}
            </div>

            {/* Right scroll button */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800"
              onClick={() => {
                const container = document.getElementById('seasonal-scroll');
                if (container) container.scrollLeft += 300;
              }}
            >
              ►
            </button>
          </div>
        </section>

        {/* Zodiac-based Adoption */}
        <section>
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt according to your Zodiac...</h2>
          <div className="grid grid-cols-4 gap-6">
            {(isZodiacExpanded ? allZodiacSigns : allZodiacSigns.slice(0, 4)).map((zodiac) => (
              <div key={zodiac} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <p className="text-green-800">{zodiac}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200" 
              onClick={() => setIsZodiacExpanded(!isZodiacExpanded)}
            >
              {isZodiacExpanded ? '▲' : '▼'}
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
