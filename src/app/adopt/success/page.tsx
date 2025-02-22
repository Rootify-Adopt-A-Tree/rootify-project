"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AdoptionDetails {
  treeCount: number;
  treeName: string;
  occasion: string;
  transactionSignature: string;
  projectName: string;
  timestamp: Date;
}

export default function AdoptionSuccess() {
  const searchParams = useSearchParams();
  const [adoptionDetails, setAdoptionDetails] = useState<AdoptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const adoptionId = searchParams.get('id');
      const signature = searchParams.get('signature');

      if (adoptionId) {
        try {
          const adoptionDoc = await getDoc(doc(db, "adoptions", adoptionId));
          if (adoptionDoc.exists()) {
            setAdoptionDetails({
              ...adoptionDoc.data() as AdoptionDetails,
              timestamp: adoptionDoc.data().timestamp.toDate(),
              transactionSignature: signature || adoptionDoc.data().transactionSignature
            });
          }
        } catch (error) {
          console.error("Error fetching adoption details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Thank You for Your Adoption!
          </h1>
          <p className="text-gray-600">
            Your contribution will help make the world greener
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Next Steps:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>NGO will plant your tree within 7 days</li>
              <li>You'll receive verification photos and location</li>
              <li>Track your tree's growth through regular updates</li>
            </ol>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Track Your Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/dashboard"
                className="bg-green-100 p-4 rounded-lg text-center hover:bg-green-200"
              >
                <h4 className="font-medium">View Dashboard</h4>
                <p className="text-sm text-gray-600">Track your adoptions</p>
              </Link>
              
              {adoptionDetails && (
                <Link 
                  href={`/verify/${searchParams.get('id')}`}
                  className="bg-blue-100 p-4 rounded-lg text-center hover:bg-blue-200"
                >
                  <h4 className="font-medium">Submit Verification</h4>
                  <p className="text-sm text-gray-600">Upload planting proof</p>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Adoption Details:</h3>
            {adoptionDetails && (
              <div className="space-y-2 text-sm">
                <p>Transaction: 
                  <a 
                    href={`https://explorer.solana.com/tx/${adoptionDetails.transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Transaction on Solana Explorer
                  </a>
                </p>
                <p>Trees: {adoptionDetails.treeCount}</p>
                <p>Name: {adoptionDetails.treeName}</p>
                <p>Occasion: {adoptionDetails.occasion}</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/adopt"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Adopt Another Tree
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 