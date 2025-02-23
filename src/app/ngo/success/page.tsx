"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';

interface NGODetails {
  name: string;
  email: string;
  city: string;
  state: string;
  darpanId: string;
}

export default function NGORegistrationSuccess() {
  const searchParams = useSearchParams();
  const [ngoDetails, setNgoDetails] = useState<NGODetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGODetails = async () => {
      const ngoId = searchParams.get('id');
      if (!ngoId) return;

      try {
        const ngoDoc = await getDoc(doc(db, "ngos", ngoId));
        if (ngoDoc.exists()) {
          setNgoDetails(ngoDoc.data() as NGODetails);
        }
      } catch (error) {
        console.error("Error fetching NGO details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGODetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Registration Successful!
            </h1>
            {ngoDetails && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Welcome, {ngoDetails.name}! Your organization has been registered successfully.
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="font-semibold text-blue-800 mb-4">Next Steps:</h2>
              <ol className="text-left text-blue-700 space-y-2">
                <li>1. Check your email for verification</li>
                <li>2. Complete your organization profile</li>
                <li>3. Start creating events and engaging with volunteers</li>
              </ol>
            </div>

            <div className="space-y-4">
              <Link 
                href="/organization/login"
                className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Go to Login
              </Link>
              <Link 
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 