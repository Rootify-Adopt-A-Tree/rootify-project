"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletSelector() {
  const { publicKey } = useWallet();

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <div className="flex flex-col gap-4">
        <WalletMultiButton className="wallet-adapter-button-trigger" />
        {publicKey && (
          <p className="text-sm text-gray-600">
            Connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
} 