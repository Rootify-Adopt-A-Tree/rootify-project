"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import type { WalletConfig } from '@privy-io/react-auth';

interface PrivyConfig {
  appearance: {
    theme: 'light' | 'dark';
    accentColor: string;
    showWalletLoginFirst?: boolean;
  };
  loginMethods: string[];
  defaultChainId?: string;
  embeddedWallets?: {
    createOnLogin?: boolean;
  };
}

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#22C55E',
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          createOnLogin: 'optional'
        },
        defaultChainId: 'solana:devnet',
      }}
      onSuccess={() => router.refresh()}
    >
      {children}
    </PrivyProvider>
  );
}

export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: 'light',
    accentColor: '#22C55E', // green-500
  },
  loginMethods: ['email', 'wallet'],
  wallets: {
    recommended: ['phantom'],
    // Remove noPromptOnSignature
    embeddedWallets: {
      createOnLogin: false
    },
    supportedWallets: ['phantom'],
    defaultChainId: 'solana:devnet',
  }
}; 