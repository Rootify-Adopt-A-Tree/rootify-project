'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Router from 'next/navigation';
import { useRouter } from 'next/router';




export default function Home() {

  const events = [
    { name: 'Mission Taljai', date: '16/02/2025', image: '/images/taljai.png' },
    { name: 'Mission Anandvan', date: '18/02/2025', image: '/images/anandvan.png' },
    { name: 'Mission Pune', date: '20/02/2025', image: '/images/pune_mission.png' }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button className="text-xl">☰</button>
          <button className="text-xl">🛒</button>
        </div>
        <nav className="flex-grow text-center font-bold text-lg">
          <ul className="flex justify-center space-x-8">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/ngos">NGOs</Link></li>
            <li><Link href="/soultree">SoulTree</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-gray-200 h-64 mt-4"></div>

      {/* Adopt a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6">ADOPT A TREE</h2>
          <Image 
            src="/images/adopt_a_tree.jpg" 
            alt="Adopt a Tree Process" 
            width={600} 
            height={200} 
            className="mx-auto"
          />
          <button   className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors">
            Adopt Now
          </button>
        </div>
      </section>

      {/* Raise a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6">RAISE A TREE</h2>
          <Image 
            src="/images/volunteer.jpg" 
            alt="Raise a Tree Process" 
            width={600} 
            height={200} 
            className="mx-auto"
          />
          <button className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors">
            Raise Now
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg text-center">
              {/* Event Image */}
              <Image 
                src={event.image} 
                alt={event.name} 
                width={200} 
                height={50} 
                className="mx-auto rounded-lg"
              />
              {/* Event Name & Date */}
              <h3 className="font-bold mt-4">{event.name}</h3>
              <p className="text-sm text-gray-600">On {event.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
