import {
  Program,
  web3,
  BN,
  AnchorProvider,
} from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface TreeAdoption {
  projectId: string;
  treeCount: number;
  adopter: PublicKey;
  price: BN;
  timestamp: BN;
  treeName: string;
  occasion: string;
}

export const TREE_ADOPTION_PROGRAM_ID = new PublicKey('7jY5t7hbpZvmcZSPrFwaHAb8DhYDupt3CwMJ2aMQXDG1'); 