"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Header from '@/components/Header';

export default function FarmerRegistration() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    landSize: '',
    experience: '',
    treeTypes: [] as string[],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "farmers"), {
        ...formData,
        wallet: publicKey.toString(),
        status: 'pending',
        rating: 0,
        completedPlantings: 0,
        earnings: 0,
        capacity: parseInt(formData.landSize) * 100, // Example calculation
        createdAt: new Date()
      });

      router.push(`/farmer/success?id=${docRef.id}`);
    } catch (error) {
      console.error("Error registering farmer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTreeTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      treeTypes: prev.treeTypes.includes(type)
        ? prev.treeTypes.filter(t => t !== type)
        : [...prev.treeTypes, type]
    }));
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Please connect your wallet to register as a farmer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Farmer Registration</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Land Size (acres)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.landSize}
                onChange={(e) => setFormData(prev => ({ ...prev, landSize: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tree Types You Can Plant</label>
              <div className="grid grid-cols-2 gap-2">
                {['Neem', 'Peepal', 'Banyan', 'Mango', 'Ashoka', 'Bamboo'].map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.treeTypes.includes(type)}
                      onChange={() => handleTreeTypeChange(type)}
                      className="rounded text-green-600"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Details</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Tell us about your farming experience and capabilities..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                <li>Our team will review your application</li>
                <li>You'll receive a verification call</li>
                <li>Once approved, you can start accepting planting requests</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 