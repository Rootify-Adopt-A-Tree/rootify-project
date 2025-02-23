"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDocs, collection, addDoc } from "firebase/firestore";
import Header from "@/components/Header";
import { usePrivy } from '@privy-io/react-auth';
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { WalletSelector } from '@/components/WalletSelector';
import { useWallet } from '@solana/wallet-adapter-react';
import { MEMO_PROGRAM_ID } from '@solana/spl-memo';

interface Project {
  id: string;
  aim: string;
  contact: string;
  darpanId: string;
  email: string;
  location: string;
  ngoName: string;
  price: string;
  projectName: string;
  state: string;
  image?: string;
  treesPlanted?: number;
  volunteers?: number;
  species?: number;
  acres?: number;
  survivalRate?: number;
  img_url?: string;
}

const PlantAdoption = () => {
  const [treeCount, setTreeCount] = useState(1);
  const [treeName, setTreeName] = useState("");
  const [story, setStory] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [selectedDate, setSelectedDate] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adoptionStatus, setAdoptionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const { login, ready, authenticated, user, logout, connectWallet } = usePrivy();
  const { publicKey, signTransaction } = useWallet();
  const [projectWallet] = useState('7jY5t7hbpZvmcZSPrFwaHAb8DhYDupt3CwMJ2aMQXDG1');
  const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log("Fetching project details for:", params.slug);
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        
        // Find the project where projectName matches the slug
        const projectDoc = projectsSnapshot.docs.find(doc => {
          const data = doc.data();
          return data.projectName.toLowerCase().replace(/\s+/g, '-') === params.slug;
        });

        if (!projectDoc) {
          setError("Project not found");
          return;
        }

        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data()
        } as Project;

        console.log("Project data:", projectData);
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProjectDetails();
    }
  }, [params.slug]);

  const handleAddToCart = () => {
    console.log("Added to cart", { treeCount, treeName, story, occasion, selectedDate });
  };

  const handleAdoptNow = async () => {
    if (!project || !publicKey || !signTransaction) return;

    setAdoptionStatus('processing');
    try {
      const connection = new Connection(DEVNET_ENDPOINT, 'confirmed');
      
      const solAmount = 0.001;
      const priceInLamports = solAmount * 1000000000;
      
      // Create memo data with adoption details
      const memoData = JSON.stringify({
        type: 'Tree Adoption',
        project: project.projectName,
        ngo: project.ngoName,
        trees: treeCount,
        treeName,
        occasion,
        location: project.location,
        timestamp: new Date().toISOString()
      });

      // Create transaction with payment and memo
      const transaction = new Transaction().add(
        // Payment instruction
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(projectWallet),
          lamports: Math.floor(priceInLamports)
        }),
        // Memo instruction
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from(memoData)
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      
      await connection.confirmTransaction(signature, 'confirmed');

      // Store adoption details in Firebase
      const adoptionRef = await addDoc(collection(db, "adoptions"), {
        projectId: project.id,
        adopterId: publicKey.toString(),
        treeCount,
        treeName,
        occasion,
        timestamp: new Date(),
        transactionSignature: signature,
        status: 'pending',
        projectName: project.projectName,
        memoData // Store the memo data for reference
      });

      setAdoptionStatus('success');
      router.push(`/adopt/success?id=${adoptionRef.id}&signature=${signature}`);

    } catch (err) {
      console.error("Adoption failed:", err);
      setAdoptionStatus('error');
    }
  };

  const handleConnectWallet = async () => {
    try {
      await login();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <br /><br />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-300 w-full h-64 relative rounded-lg overflow-hidden">
            <img 
              src={project.img_url || "/default-project-image.jpg"} 
              alt={project.projectName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{project.projectName}</h2>
          <br />
          <br />
          <p className="text-xl font-bold">Price: ₹200</p>
          <br />
          <p className="text-lg text-gray-600 font-semibold">NGO: {project.ngoName}</p>
          <br />
            <p className="text-md text-gray-600 font-semibold">Location: {project.location}, {project.state}</p>
            <br />
            <p className="text-md text-gray-600 font-semibold">Contact: {project.contact}</p>

          <div className="mt-4">
            
            {/* <p className="text-sm text-gray-600">Darpan ID: {project.darpanId}</p> */}
          </div>
        </div>
      </div>
          <p className="font-bold text-lg">OUR AIM: </p>
          <span>{project.aim}</span>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-4">
          <span>Number of trees:</span>
          <button 
            onClick={() => setTreeCount(Math.max(1, treeCount - 1))}
            className="bg-green-500 text-white w-8 h-8 rounded-full"
          >
            -
          </button>
          <span className="mx-2">{treeCount}</span>
          <button 
            onClick={() => setTreeCount(treeCount + 1)}
            className="bg-green-500 text-white w-8 h-8 rounded-full"
          >
            +
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Name your Tree"
          className="w-full border p-2 mt-2 rounded"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
        />
        
        <select 
          className="w-full border p-2 mt-2 rounded" 
          value={occasion} 
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option>Birthday</option>
          <option>Anniversary</option>
          <option>Memorial</option>
        </select>
        
        <textarea
          maxLength={200}
          placeholder="Story behind tree"
          className="w-full border p-2 mt-2 rounded"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        
        <input
          type="date"
          className="w-full border p-2 mt-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Connect Solana Wallet</h3>
        <WalletSelector />
        
        {adoptionStatus === 'success' && (
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <p className="text-green-700">Adoption successful on Devnet!</p>
            <p className="text-sm text-gray-600 mt-2">
              From: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
            </p>
            <p className="text-sm text-gray-600">
              Amount: 0.001 SOL (Devnet)
            </p>
            {transactionSignature && (
              <a 
                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline mt-2 block"
              >
                View on Solana Explorer (Devnet)
              </a>
            )}
          </div>
        )}

        {adoptionStatus === 'error' && (
          <div className="bg-red-50 p-4 rounded-lg mt-4">
            <p className="text-red-700" id="error-message">Adoption failed. Please try again.</p>
            <p className="text-sm text-gray-600 mt-2">
              Make sure you have enough SOL in your wallet to cover:
              <br />
              - Tree adoption cost: 0.001 SOL
              <br />
              - Transaction fee: ~0.000005 SOL
            </p>
          </div>
        )}

        <button 
          onClick={handleAdoptNow}
          disabled={!publicKey || adoptionStatus === 'processing'}
          className={`w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600 transition-colors
            ${(!publicKey || adoptionStatus === 'processing') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {!publicKey ? 'Connect Wallet to Adopt' : 
           adoptionStatus === 'processing' ? 'Processing...' : 'Adopt Now'}
        </button>
      </div>
    </div>
  );
};

export default PlantAdoption;