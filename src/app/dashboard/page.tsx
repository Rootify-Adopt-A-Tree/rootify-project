"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from 'next/link';
import Header from '@/components/Header';
import IPFSUploadTest from '@/components/IPFSUploadTest';

interface Adoption {
  id: string;
  projectId: string;
  projectName: string;
  treeCount: number;
  treeName: string;
  occasion: string;
  timestamp: Date;
  status: 'pending' | 'verified' | 'rejected';
  transactionSignature: string;
}

interface Project {
  ngoName: string;
  location: string;
  state: string;
  image?: string;
  aim: string;
}

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [adoptions, setAdoptions] = useState<(Adoption & { project?: Project })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        // Query adoptions
        const adoptionsRef = collection(db, "adoptions");
        const q = query(
          adoptionsRef,
          where("adopterId", "==", publicKey.toString())
        );

        const querySnapshot = await getDocs(q);
        const adoptionsData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            // Fetch associated project details
            const projectRef = doc(db, "projects", data.projectId);
            const projectDoc = await getDoc(projectRef);
            const projectData = projectDoc.exists() ? projectDoc.data() as Project : undefined;
            
            return {
              id: docSnapshot.id,
              ...data,
              timestamp: data.timestamp.toDate(),
              project: projectData
            } as Adoption & { project?: Project };
          })
        );

        // Sort by most recent first
        adoptionsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setAdoptions(adoptionsData);
      } catch (error) {
        console.error("Error fetching adoptions:", error);
        setError("Failed to load your adoptions");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg mb-4">Please connect your wallet to view your adoptions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tree Adoptions</h1>
          <Link 
            href="/adopt"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Adopt More Trees
          </Link>
        </div>

        <div className="mb-8">
          <IPFSUploadTest />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : adoptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You haven't adopted any trees yet</p>
            <Link 
              href="/adopt"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Adopt Your First Tree →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptions.map((adoption) => (
              <div key={adoption.id} className="bg-white rounded-lg shadow p-6">
                {adoption.project?.image && (
                  <div className="h-48 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={adoption.project.image}
                      alt={adoption.projectName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{adoption.projectName}</h3>
                    <p className="text-sm text-gray-600">{adoption.project?.ngoName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    adoption.status === 'verified' ? 'bg-green-100 text-green-800' :
                    adoption.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {adoption.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Trees: {adoption.treeCount}</p>
                  <p>Name: {adoption.treeName}</p>
                  <p>Occasion: {adoption.occasion}</p>
                  <p>Date: {adoption.timestamp.toLocaleDateString()}</p>
                  <p>Location: {adoption.project?.location}, {adoption.project?.state}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {adoption.status === 'pending' && (
                    <Link
                      href={`/verify/${adoption.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Submit Verification →
                    </Link>
                  )}
                  <a
                    href={`https://explorer.solana.com/tx/${adoption.transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    View Transaction ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 