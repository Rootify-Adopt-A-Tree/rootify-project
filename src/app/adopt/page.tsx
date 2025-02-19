'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdoptPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Mission-based Adoption */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt with...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Mission Taljai', 'Mission Anandvan', 'Mission Pune'].map((mission) => (
              <div key={mission} className="bg-green-50 rounded-lg p-4 text-center">
                <div className="aspect-square bg-gray-600 rounded-lg mb-3"></div>
                <p className="text-green-800">{mission}</p>
              </div>
            ))}
          </div>
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
            {['Aries', 'Taurus', 'Gemini', 'Cancer'].map((zodiac) => (
              <div key={zodiac} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <p className="text-green-800">{zodiac}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="text-gray-500">▼</button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}