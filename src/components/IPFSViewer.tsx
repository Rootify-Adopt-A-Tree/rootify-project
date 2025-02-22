"use client";

import { useState, useEffect } from 'react';
import { getFromIPFS } from '@/lib/ipfs-config';

export function IPFSViewer({ cid }: { cid: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIPFSData() {
      try {
        const ipfsData = await getFromIPFS(cid);
        setData(ipfsData);
      } catch (error) {
        console.error('Error fetching IPFS data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIPFSData();
  }, [cid]);

  if (loading) return <div>Loading IPFS data...</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div>
      {data.images?.map((imageUrl: string, index: number) => (
        <img 
          key={index}
          src={imageUrl}
          alt={`Verification ${index + 1}`}
          className="rounded-lg mb-4"
        />
      ))}
      <div className="text-sm text-gray-600">
        <p>Verified by: {data.verifier}</p>
        <p>Date: {new Date(data.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  );
} 