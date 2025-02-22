import { Program, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { create } from 'ipfs-http-client';

// IPFS client setup
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export interface TreeVerification {
  treeId: string;
  location: { lat: number; lng: number };
  plantingDate: Date;
  images: string[]; // IPFS hashes
  verifierAddress: string;
  status: 'pending' | 'verified' | 'rejected';
  proofHash: string; // IPFS hash of all verification data
} 