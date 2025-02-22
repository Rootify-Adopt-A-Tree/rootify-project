"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletSelector } from '@/components/WalletSelector';
import { useLoadRazorpay } from '@/hooks/useLoadRazorpay';

interface TreeDetails {
  name: string;
  price: string;
  sci_name: string;
  details: string;
  n_des: string;
  imageUrl: string;
}

export default function TreePage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const [tree, setTree] = useState<TreeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [treeCount, setTreeCount] = useState(1);
  const [treeName, setTreeName] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [story, setStory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'solana'>('razorpay');
  const loadRazorpay = useLoadRazorpay();

  useEffect(() => {
    const fetchTreeDetails = async () => {
      try {
        const treesRef = collection(db, "trees");
        if (!params?.slug) return;
        const q = query(
          treesRef, 
          where("name", "==", params.slug.toString().split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '))
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setError("Tree not found");
          return;
        }

        const treeData = snapshot.docs[0].data() as TreeDetails;
        setTree(treeData);
      } catch (error) {
        console.error("Error fetching tree:", error);
        setError("Failed to load tree details");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchTreeDetails();
    }
  }, [params.slug]);

  const handleIncrement = () => {
    setTreeCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setTreeCount(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderData = {
        amount: parseInt(tree!.price) * treeCount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `tree-${Date.now()}`,
      };

      // Create order on your backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Rootify",
        description: `Adopt ${treeCount} ${tree!.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          // Verify payment on backend
          const verification = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verification.ok) {
            // Record the adoption in Firebase
            // Create transaction on Solana (we can use a program-owned wallet)
            // Redirect to success page
          }
        },
        prefill: {
          name: treeName,
          email: "", // You can add email field to form if needed
        },
        theme: {
          color: "#22C55E",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded">
            {error || "Tree not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Image and Description */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden mb-6">
              <img 
                src={tree.imageUrl} 
                alt={tree.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">{tree.name}</h2>
            <p className="text-gray-600 italic mb-4">{tree.sci_name}</p>
            <div className="prose max-w-none">
              <p className="text-gray-700">{tree.n_des}</p>
            </div>
          </div>

          {/* Right Column - Adoption Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">₹{tree.price}</h3>
              <p className="text-gray-600">{tree.details}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of trees you intend to plant
                </label>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleDecrement}
                    className="bg-gray-100 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{treeCount}</span>
                  <button 
                    onClick={handleIncrement}
                    className="bg-gray-100 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name your Tree
                </label>
                <input
                  type="text"
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select occasion
                </label>
                <select 
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Memorial</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story behind tree
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="pt-4">
                <div className="flex gap-4 mb-4">
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      paymentMethod === 'razorpay' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    Pay with ₹
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded ${
                      paymentMethod === 'solana' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setPaymentMethod('solana')}
                  >
                    Pay with SOL
                  </button>
                </div>

                {paymentMethod === 'solana' ? (
                  <>
                    <WalletSelector />
                    {publicKey ? (
                      <button 
                        className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
                      >
                        Adopt Now with SOL
                      </button>
                    ) : (
                      <p className="text-center text-gray-600 mt-4">
                        Connect wallet to adopt
                      </p>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={handleRazorpayPayment}
                    className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
                  >
                    Pay ₹{parseInt(tree.price) * treeCount}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}