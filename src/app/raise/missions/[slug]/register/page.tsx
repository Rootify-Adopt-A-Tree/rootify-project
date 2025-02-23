"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Confetti from 'react-confetti';
import Header from '@/components/Header';
import Link from 'next/link';

export default function RegisterConfirmation() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const params = useParams();

  useEffect(() => {
    // Set window size for confetti
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial size
    updateWindowSize();

    // Update on resize
    window.addEventListener('resize', updateWindowSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        colors={['#22C55E', '#15803D', '#86EFAC']} // Green shades
      />
      
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h1 className="text-4xl font-bold text-green-700 mb-6">
              Thank You for Volunteering! 🌱
            </h1>
            
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Your commitment to making our planet greener is truly appreciated.
              </p>
              <p>
                We're excited to see you at the event!
              </p>
              <p className="text-sm mt-8">
                A confirmation email will be sent to you with the event details.
              </p>
            </div>

            <div className="mt-12 space-x-4">
              <Link 
                href={`/raise/missions/${params.slug}`}
                className="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Back to Events
              </Link>
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What's Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  We'll send you detailed information about the event location and what to bring.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-2">Save the Date</h3>
                <p className="text-sm text-gray-600">
                  Mark your calendar and set a reminder for the event day.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-2">Stay Connected</h3>
                <p className="text-sm text-gray-600">
                  Follow us on social media for updates and community highlights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 