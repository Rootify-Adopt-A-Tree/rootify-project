"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Header from '@/components/Header';
import Link from 'next/link';

interface PlantingRequest {
  id: string;
  userId: string;
  treeCount: number;
  treeType: string;
  status: 'pending' | 'accepted' | 'completed';
  requestDate: Date;
  location: string;
  payment: number;
}

interface FarmerProfile {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  landSize: number;
  experience: number;
  treeTypes: string[];
  capacity: number;
  completedPlantings: number;
  rating: number;
  earnings: number;
}

export default function FarmerDashboard() {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [requests, setRequests] = useState<PlantingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'earnings'>('overview');

  useEffect(() => {
    const fetchFarmerData = async () => {
      if (!publicKey) return;

      try {
        // Fetch farmer profile
        const farmersRef = collection(db, "farmers");
        const q = query(farmersRef, where("wallet", "==", publicKey.toString()));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const farmerData = snapshot.docs[0].data() as FarmerProfile;
          setProfile(farmerData);

          // Fetch planting requests
          const requestsRef = collection(db, "plantingRequests");
          const requestsQuery = query(requestsRef, where("farmerId", "==", snapshot.docs[0].id));
          const requestsSnapshot = await getDocs(requestsQuery);

          const requestsData = requestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            requestDate: doc.data().requestDate.toDate()
          })) as PlantingRequest[];

          setRequests(requestsData);
        }
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Please connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Status Banner */}
            {profile.status === 'pending' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your application is under review. We'll notify you once it's approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500">{profile.location}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">Land Size</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{profile.landSize} acres</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Experience</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{profile.experience} years</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-800">Trees Planted</h3>
                    <p className="mt-2 text-3xl font-bold text-purple-600">{profile.completedPlantings}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800">Rating</h3>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{profile.rating}/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b">
                <nav className="-mb-px flex">
                  {['overview', 'requests', 'earnings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`${
                        activeTab === tab
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Tree Types</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.treeTypes.map((type) => (
                          <span
                            key={type}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Monthly Capacity</h3>
                      <p className="mt-2 text-gray-600">{profile.capacity} trees per month</p>
                    </div>
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{request.treeType}</h4>
                            <p className="text-sm text-gray-500">{request.treeCount} trees</p>
                            <p className="text-sm text-gray-500">{request.location}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status}
                            </span>
                            <p className="mt-1 text-sm font-medium">₹{request.payment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-green-800">Total Earnings</h3>
                      <p className="mt-2 text-4xl font-bold text-green-600">₹{profile.earnings}</p>
                    </div>

                    {/* Add earnings chart or detailed breakdown here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>No farmer profile found. Would you like to register as a farmer?</p>
            <Link
              href="/farmer/register"
              className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Register as Farmer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 