"use client";

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function OrganizationRegister() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 md:pt-20"></div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Join Rootify as an Organization
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose your role in making the world greener. Whether you're a farmer ready to plant or an NGO looking to make an impact, we've got a place for you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Farmer Registration Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <Image
                src="/images/farmer.png"
                alt="Farmer"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Register as Farmer</h3>
              <p className="text-gray-600 mb-4">
                Join our network of farmers and help grow a greener future. Plant trees and earn rewards.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Accept tree planting requests
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Earn from each tree planted
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Get support and resources
                </li>
              </ul>
              <Link
                href="/farmer/register"
                className="block w-full bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Register as Farmer
              </Link>
            </div>
          </div>

          {/* NGO Registration Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Image
                src="/images/ngo.png"
                alt="NGO"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Register as NGO</h3>
              <p className="text-gray-600 mb-4">
                Partner with us to amplify your environmental impact. Connect with donors and volunteers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Receive donations and support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Organize planting events
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Access our volunteer network
                </li>
              </ul>
              <Link
                href="/ngo/register"
                className="block w-full bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Register as NGO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 