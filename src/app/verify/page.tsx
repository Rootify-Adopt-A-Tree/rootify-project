"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Header from '@/components/Header';

interface Verification {
  id: string;
  adoptionId: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp: Date;
  images?: string[];
  location?: { lat: number; lng: number };
  verifierNotes?: string;
  verifier: string;
}

export default function VerifyPage() {
  const { publicKey } = useWallet();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const verificationsRef = collection(db, "verifications");
        const q = query(
          verificationsRef,
          where("verifier", "==", publicKey.toString())
        );

        const querySnapshot = await getDocs(q);
        const verificationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as Verification[];

        setVerifications(verificationsData);
      } catch (error) {
        console.error("Error fetching verifications:", error);
        setError("Failed to load verifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Verification Status</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!publicKey ? (
          <div className="text-center py-8">
            <p>Please connect your wallet to view verifications</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : verifications.length === 0 ? (
          <div className="text-center py-8">
            <p>No verifications found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {verifications.map((verification) => (
              <div key={verification.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">Verification #{verification.id.slice(0, 8)}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    verification.status === 'verified' ? 'bg-green-100 text-green-800' :
                    verification.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {verification.status}
                  </span>
                </div>

                {verification.images && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {verification.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image}
                        alt={`Verification ${index + 1}`}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {verification.location && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Location: {verification.location.lat}, {verification.location.lng}
                    </p>
                  </div>
                )}

                {verification.verifierNotes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{verification.verifierNotes}</p>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Submitted: {verification.timestamp.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 