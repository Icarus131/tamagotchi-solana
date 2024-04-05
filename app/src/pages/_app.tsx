import "@/styles/globals.css";
import type { AppProps } from "next/app";
import head from "next/head";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { SnapWalletAdapter } from "@drift-labs/snap-wallet-adapter";

export default function App({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  // Check if the Connect by Drift wallet adapter is available
  const driftSnapWalletAdapter =
    typeof window !== "undefined" && window?.solana?.isPhantom
      ? new SnapWalletAdapter()
      : undefined;

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div>
            <ConnectionProvider endpoint={endpoint}>
              {/* Provide an array with Connect by Drift wallet adapter if available */}
              <WalletProvider
                wallets={driftSnapWalletAdapter ? [driftSnapWalletAdapter] : []}
                autoConnect
              >
                <Component {...pageProps} />
              </WalletProvider>
            </ConnectionProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
