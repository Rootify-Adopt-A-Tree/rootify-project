"use client";

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface PlantingRequestFormProps {
  farmerId: string;
  location: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlantingRequestForm({ farmerId, location, onClose, onSuccess }: PlantingRequestFormProps) {
  const { publicKey } = useWallet();
  const [treeCount, setTreeCount] = useState(1);
  const [treeType, setTreeType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "plantingRequests"), {
        farmerId,
        userId: publicKey.toString(),
        treeCount,
        treeType,
        notes,
        location,
        status: 'pending',
        requestDate: new Date(),
        payment: treeCount * 500 // Example price calculation
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Trees</label>
        <input
          type="number"
          min="1"
          value={treeCount}
          onChange={(e) => setTreeCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tree Type</label>
        <select
          value={treeType}
          onChange={(e) => setTreeType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Select a tree type</option>
          <option value="neem">Neem</option>
          <option value="peepal">Peepal</option>
          <option value="banyan">Banyan</option>
          <option value="mango">Mango</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Cost per tree:</span>
          <span>₹500</span>
        </div>
        <div className="flex justify-between font-medium mt-2">
          <span>Total cost:</span>
          <span>₹{treeCount * 500}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !treeType}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
} 