"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from '@/components/Header';

export default function FarmerRegistrationSuccess() {
  const searchParams = useSearchParams();
  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) setFarmerId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Registration Successful!</h1>
            <p className="text-gray-600 mt-2">Your application is under review</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="font-semibold text-blue-800 mb-2">Next Steps:</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>Our team will review your application</li>
                <li>You'll receive verification on your registered phone</li>
                <li>Once approved, you can start accepting planting requests</li>
              </ol>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">While you wait, you can:</h3>
              <div className="grid gap-4">
                <Link
                  href="/farmer/dashboard"
                  className="block p-4 bg-green-50 rounded-lg hover:bg-green-100"
                >
                  <h4 className="font-medium text-green-800">View Dashboard</h4>
                  <p className="text-sm text-green-600">Track your application status</p>
                </Link>

                <Link
                  href="/explore"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <h4 className="font-medium text-blue-800">Explore Map</h4>
                  <p className="text-sm text-blue-600">See planting opportunities in your area</p>
                </Link>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Have questions? Contact our support team</p>
              <p className="mt-1">support@rootify.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 