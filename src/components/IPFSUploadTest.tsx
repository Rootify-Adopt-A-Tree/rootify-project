"use client";

import { useState } from 'react';
import { uploadToIPFS } from '@/lib/ipfs-config';

export default function IPFSUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadToIPFS(file);
      setIpfsUrl(url);
      console.log('File uploaded to IPFS:', url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      {/* <h2 className="text-lg font-semibold mb-4">IPFS Upload Test</h2> */}
      
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`bg-green-500 text-white px-4 py-2 rounded
          ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
      >
        {uploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>

      {error && (
        <div className="text-red-600 mt-2">
          {error}
        </div>
      )}

      {ipfsUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">File uploaded successfully!</p>
          <a 
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
} 