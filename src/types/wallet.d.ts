declare global {
  interface Window {
    phantom?: {
      solana?: {
        connect(): Promise<void>;
        disconnect(): Promise<void>;
        signTransaction(transaction: any): Promise<any>;
        signAllTransactions(transactions: any[]): Promise<any[]>;
        signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
      };
    };
  }
}

export {}; 