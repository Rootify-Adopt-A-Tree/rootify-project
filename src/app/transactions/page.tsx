"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import Link from 'next/link';
import Header from '@/components/Header';

interface Transaction {
  id: string;
  projectId: string;
  adopterId: string;
  treeCount: number;
  treeName: string;
  occasion: string;
  timestamp: Date;
  transactionSignature: string;
  status: 'pending' | 'verified' | 'rejected';
  projectName: string;
  story?: string;
}

interface Project {
  aim: string;
  ngoName: string;
  location: string;
  state: string;
  image?: string;
}

export default function TransactionsPage() {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<(Transaction & { project?: Project }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (projectDoc.exists()) {
        return projectDoc.data() as Project;
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
    return null;
  };

  const handleViewDetails = async (tx: Transaction) => {
    const project = await fetchProjectDetails(tx.projectId);
    if (project) {
      setSelectedTx({ ...tx, project });
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const adoptionsRef = collection(db, "adoptions");
        const q = query(
          adoptionsRef,
          where("adopterId", "==", publicKey.toString())
        );

        const querySnapshot = await getDocs(q);
        const transactionsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(),
            transactionSignature: data.transactionSignature || null
          } as Transaction;
        });

        transactionsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!publicKey ? (
          <div className="text-center py-8">
            <p>Please connect your wallet to view transactions</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">No transactions found</p>
            <Link 
              href="/adopt"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Adopt Your First Tree →
            </Link>
          </div>
        ) : (
          <>
            {selectedTx && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">Tree Adoption Details</h2>
                    <button 
                      onClick={() => setSelectedTx(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {selectedTx.project?.image && (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img 
                          src={selectedTx.project.image} 
                          alt={selectedTx.projectName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-600">Project</h3>
                        <p>{selectedTx.projectName}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-600">NGO</h3>
                        <p>{selectedTx.project?.ngoName}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-600">Location</h3>
                        <p>{selectedTx.project?.location}, {selectedTx.project?.state}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-600">Date</h3>
                        <p>{selectedTx.timestamp.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-600">Trees</h3>
                        <p>{selectedTx.treeCount}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-600">Status</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          selectedTx.status === 'verified' ? 'bg-green-100 text-green-800' :
                          selectedTx.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTx.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Mission</h3>
                      <p className="text-gray-700">{selectedTx.project?.aim}</p>
                    </div>

                    {selectedTx.story && (
                      <div>
                        <h3 className="font-semibold text-gray-600 mb-2">Your Story</h3>
                        <p className="text-gray-700">{selectedTx.story}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Transaction</h3>
                      <a 
                        href={`https://explorer.solana.com/tx/${selectedTx.transactionSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Solana Explorer ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(tx)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.timestamp.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{tx.projectName}</td>
                      <td className="px-6 py-4">{tx.treeCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'verified' ? 'bg-green-100 text-green-800' :
                          tx.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.status === 'pending' && (
                          <Link
                            href={`/verify/${tx.id}`}
                            className="text-blue-600 hover:underline mr-4"
                          >
                            Submit Verification
                          </Link>
                        )}
                        {tx.transactionSignature && (
                          <a 
                            href={`https://explorer.solana.com/tx/${tx.transactionSignature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Transaction ↗
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 