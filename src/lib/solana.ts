import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

export const connection = new Connection(clusterApiUrl('devnet'));
export const wallet = new PhantomWalletAdapter();

export const connectWallet = async () => {
  try {
    await wallet.connect();
    return wallet.publicKey;
  } catch (err) {
    console.error("Error connecting wallet:", err);
    throw err;
  }
};

export const adoptTree = async (
  projectId: string,
  treeCount: number,
  price: number,
  treeName: string,
  occasion: string
) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const transaction = new Transaction();
  // Add your program instruction here
  // This will vary based on your specific Solana program

  try {
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (err) {
    console.error("Error adopting tree:", err);
    throw err;
  }
}; 