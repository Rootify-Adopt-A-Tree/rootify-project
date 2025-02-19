'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const processSteps = [
    { title: 'Select a Location', icon: <MapPin className="w-8 h-8 text-white" /> },
    { title: 'Choose Your Cause', icon: '🌱' },
    { title: 'Tell Your Story', icon: '📝' },
    { title: 'Get a Reward', icon: <Award className="w-8 h-8 text-white" /> }
  ];

  const raiseSteps = [
    { title: 'Select a Location', icon: <MapPin className="w-8 h-8 text-white" /> },
    { title: 'Choose date and time', icon: <Calendar className="w-8 h-8 text-white" /> },
    { title: 'Show Up', icon: '🌳' },
    { title: 'Get a Reward', icon: <Award className="w-8 h-8 text-white" /> }
  ];

  const events = [
    { name: 'Mission Taljai', date: '16/02/2025' },
    { name: 'Mission Anandvan', date: '18/02/2025' },
    { name: 'Mission Pune', date: '20/02/2025' }
  ];

  const soulTreeCategories = [
    { name: 'ZODIAC', icon: '☀️' },
    { name: 'SEASONS', icon: '❄️' },
    { name: 'OCCASIONS', icon: '💝' }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gray-200 h-64 mt-16"></div>

      {/* Adopt a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">ADOPT A TREE</h2>
          <div className="flex flex-wrap justify-between items-center gap-4">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  index % 4 === 0 ? 'bg-rose-400' :
                  index % 4 === 1 ? 'bg-orange-400' :
                  index % 4 === 2 ? 'bg-green-400' :
                  'bg-blue-400'
                }`}>
                  {step.icon}
                </div>
                <p className="mt-2 text-sm text-center">{step.title}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors">
            Adopt Now
          </button>
        </Card>
      </section>

      {/* Raise a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">RAISE A TREE</h2>
          <div className="flex flex-wrap justify-between items-center gap-4">
            {raiseSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  index % 4 === 0 ? 'bg-rose-400' :
                  index % 4 === 1 ? 'bg-orange-400' :
                  index % 4 === 2 ? 'bg-green-400' :
                  'bg-blue-400'
                }`}>
                  {step.icon}
                </div>
                <p className="mt-2 text-sm text-center">{step.title}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors">
            Raise Now
          </button>
        </Card>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card key={index} className="p-4">
              <CardContent>
                <h3 className="font-bold mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600">On {event.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Find Your Soultree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Find Your Soultree</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {soulTreeCategories.map((category, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                {category.icon}
              </div>
              <p className="mt-2 font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}

      <Footer />
      {/* <section className="bg-green-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">ADDRESS</h3>
              <p className="text-sm">
                VIT Pune, 666 Upper<br />
                Indira Nagar,<br />
                Bibwewadi,<br />
                Pune-411041<br />
                Phn No:- xxxxxxxx
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Email Address</h3>
              <a href="mailto:abc@xyz.com" className="text-sm text-blue-600 hover:text-blue-800">
                abc@xyz.com
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-2">Partners</h3>
              <p className="text-sm hover:text-green-700 cursor-pointer">
                Become a Corporate Partner
              </p>
              <p className="text-sm hover:text-green-700 cursor-pointer mt-1">
                Become an NGO Partner
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}