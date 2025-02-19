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
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt these Seasonal ones...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Mango', price: 'XXX' },
              { name: 'Jammun', price: 'XXX' },
              { name: 'Watermelon', price: 'XXX' }
            ].map((tree) => (
              <div key={tree.name} className="bg-green-50 rounded-lg p-4 text-center">
                <div className="aspect-square bg-gray-600 rounded-lg mb-3"></div>
                <p className="text-green-800">{tree.name}</p>
                <p className="text-gray-600">Price: {tree.price}</p>
              </div>
            ))}
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