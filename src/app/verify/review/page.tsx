"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function VerificationReview() {
  const [verifications, setVerifications] = useState([]);
  const { publicKey } = useWallet();

  const handleVerify = async (verificationId: string, decision: 'approve' | 'reject') => {
    // Update verification status
    // Trigger smart contract for token release if approved
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Review Verifications</h1>
      
      {verifications.map((verification) => (
        <div key={verification.id} className="border p-4 rounded mb-4">
          <div className="grid grid-cols-2 gap-4">
            {verification.images.map((image, index) => (
              <img 
                key={index}
                src={`https://ipfs.io/ipfs/${image}`}
                alt={`Verification ${index + 1}`}
                className="rounded"
              />
            ))}
          </div>
          
          <div className="mt-4 flex justify-end space-x-4">
            <button 
              onClick={() => handleVerify(verification.id, 'approve')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button 
              onClick={() => handleVerify(verification.id, 'reject')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 