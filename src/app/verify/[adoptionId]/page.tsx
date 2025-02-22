"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, updateDoc, query, getDocs, where } from "firebase/firestore";
import { uploadToIPFS } from '@/lib/ipfs-config';
import Header from '@/components/Header';
import Link from 'next/link';

interface AdoptionDetails {
  projectId: string;
  projectName: string;
  treeCount: number;
  adopterId: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface VerificationData {
  images: string[];
  location: string;
  notes: string;
  timestamp: string;
  verifier: string;
  status: 'pending' | 'verified' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export default function VerificationPage() {
  const { publicKey } = useWallet();
  const params = useParams();
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [adoption, setAdoption] = useState<AdoptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<VerificationData | null>(null);
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    const fetchVerificationDetails = async () => {
      if (!params.adoptionId || !publicKey) return;

      try {
        // Fetch adoption details
        const adoptionDoc = await getDoc(doc(db, "adoptions", params.adoptionId as string));
        if (adoptionDoc.exists()) {
          setAdoption(adoptionDoc.data() as AdoptionDetails);
        }

        // Check if verification already exists
        const verificationsRef = collection(db, "verifications");
        const q = query(verificationsRef, where("adoptionId", "==", params.adoptionId));
        const verificationSnapshot = await getDocs(q);
        
        if (!verificationSnapshot.empty) {
          const verificationData = verificationSnapshot.docs[0].data() as VerificationData;
          setSubmittedData(verificationData);
          setSubmitted(true);
        }

        // Check if current user is a reviewer
        const reviewerDoc = await getDoc(doc(db, "reviewers", publicKey.toString()));
        console.log("Checking reviewer status for:", publicKey.toString());
        console.log("Is reviewer?", reviewerDoc.exists());
        setIsReviewer(reviewerDoc.exists());

      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to load details");
      }
    };

    fetchVerificationDetails();
  }, [params.adoptionId, publicKey]);

  // Helper function to validate Google Maps URL
  const isValidGoogleMapsUrl = (url: string) => {
    return url.includes('google.com/maps') || url.includes('goo.gl/maps');
  };

  const handleSubmitVerification = async () => {
    if (!publicKey || !adoption || images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    if (!isValidGoogleMapsUrl(location)) {
      setError("Please enter a valid Google Maps location link");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Upload each image to IPFS
      setUploadProgress(0);
      const totalImages = images.length;
      const imageUrls = await Promise.all(
        images.map(async (image, index) => {
          const url = await uploadToIPFS(image);
          setUploadProgress(((index + 1) / totalImages) * 100);
          return url;
        })
      );

      // Create verification metadata
      const verificationData: VerificationData = {
        images: imageUrls,
        location,
        notes,
        timestamp: new Date().toISOString(),
        verifier: publicKey.toString(),
        status: 'pending'
      };

      // Upload metadata to IPFS
      const metadataUrl = await uploadToIPFS(
        new File(
          [JSON.stringify(verificationData)],
          'metadata.json',
          { type: 'application/json' }
        )
      );

      // Store verification in Firebase
      await addDoc(collection(db, "verifications"), {
        ...verificationData,
        adoptionId: params.adoptionId,
        ipfsUrl: metadataUrl,
      });

      // Update adoption status
      await updateDoc(doc(db, "adoptions", params.adoptionId as string), {
        status: 'pending_verification'
      });

      setSubmittedData(verificationData);
      setSubmitted(true);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading verification:', error);
      setError('Failed to submit verification');
    }
  };

  const handleVerificationReview = async (status: 'verified' | 'rejected') => {
    if (!publicKey || !submittedData || !params.adoptionId) return;

    try {
      // Get verification document ID
      const verificationsRef = collection(db, "verifications");
      const q = query(verificationsRef, where("adoptionId", "==", params.adoptionId));
      const verificationSnapshot = await getDocs(q);
      
      if (verificationSnapshot.empty) {
        throw new Error("Verification not found");
      }

      const verificationId = verificationSnapshot.docs[0].id;

      // Update verification status
      await updateDoc(doc(db, "verifications", verificationId), {
        status,
        reviewedBy: publicKey.toString(),
        reviewedAt: new Date().toISOString()
      });

      // Update adoption status
      await updateDoc(doc(db, "adoptions", params.adoptionId), {
        status
      });

      // Update local state
      setSubmittedData({
        ...submittedData,
        status,
        reviewedBy: publicKey.toString(),
        reviewedAt: new Date().toISOString()
      });

      alert(`Verification ${status === 'verified' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating verification:', error);
      setError('Failed to update verification status');
    }
  };

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (submitted && submittedData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Verification Details</h1>
          
          <div className={`p-4 rounded-lg mb-6 ${
            submittedData.status === 'verified' ? 'bg-green-50 text-green-700' :
            submittedData.status === 'rejected' ? 'bg-red-50 text-red-700' :
            'bg-yellow-50 text-yellow-700'
          }`}>
            <p>
              Status: {submittedData.status.charAt(0).toUpperCase() + submittedData.status.slice(1)}
              {submittedData.reviewedBy && ` • Reviewed by: ${submittedData.reviewedBy.slice(0, 6)}...${submittedData.reviewedBy.slice(-4)}`}
              {submittedData.reviewedAt && ` • ${new Date(submittedData.reviewedAt).toLocaleDateString()}`}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="font-semibold mb-4">Uploaded Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {submittedData.images.map((url, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <img 
                      src={url}
                      alt={`Verification ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Location</h2>
              <a 
                href={submittedData.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                View Location on Google Maps ↗
              </a>
            </div>

            {submittedData.notes && (
              <div>
                <h2 className="font-semibold mb-2">Notes</h2>
                <p className="text-gray-600">{submittedData.notes}</p>
              </div>
            )}

            {isReviewer && submittedData.status === 'pending' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold mb-4">Verification Review</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVerificationReview('verified')}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Approve Verification
                  </button>
                  <button
                    onClick={() => handleVerificationReview('rejected')}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Reject Verification
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 mt-6 border-t">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to Dashboard
              </Link>
              
              {submittedData.status === 'pending' && !isReviewer && (
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Edit Submission
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Submit Tree Planting Verification</h1>
      
      {adoption && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h2 className="font-semibold mb-2">Adoption Details</h2>
          <p>Project: {adoption.projectName}</p>
          <p>Trees: {adoption.treeCount}</p>
          <p>Status: {adoption.status}</p>
        </div>
      )}

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Images</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload clear images showing the planted trees
          </p>
        </div>

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <div className="space-y-2">
            <input 
              type="url"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Paste Google Maps location link"
            />
            <div className="flex items-center space-x-2">
              <a 
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Open Google Maps ↗
              </a>
              <span className="text-sm text-gray-500">
                (Share the location link of where the tree was planted)
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Add any additional notes about the planting"
          />
        </div>

        <button
          onClick={handleSubmitVerification}
          disabled={uploading || images.length === 0}
          className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600
            ${(uploading || images.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Submit Verification'}
        </button>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="bg-red-50 text-red-700 p-4 rounded">
        {error}
      </div>
    </div>
  );
} 