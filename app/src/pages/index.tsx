import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";

const WalletConnector = dynamic(() => import("../components/Wallets"), {
  ssr: false,
});

export default function IndexPage() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [tamagotchiNFTs, setTamagotchiNFTs] = useState<any[]>([]);

  useEffect(() => {
    const fetchTamagotchiNFTs = async () => {
      if (!walletAddress) return;

      try {
        const connection = new Connection(
          "https://api.mainnet-beta.solana.com"
        );

        const tokenAccounts = await connection.getTokenAccountsByOwner(
          new PublicKey(walletAddress),
          { programId: new PublicKey("Token program ID") } // Replace 'Token program ID' with actual program ID
        );

        const tamagotchiNFTAccounts = tokenAccounts.value.filter(
          (account: any) => {
            return account.account.data.yourMetadataField === "Tamagotchi";
          }
        );

        setTamagotchiNFTs(tamagotchiNFTAccounts);
      } catch (error) {
        console.error("Error fetching Tamagotchi NFTs:", error);
      }
    };

    fetchTamagotchiNFTs();
  }, [walletAddress]);

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="hero-content flex-col lg:flex-row">
            <img src="/hero.png" className="max-w-sm rounded-lg shadow-2xl" />
            <div className="max-w-md">
              <h1 className="text-2xl font-bold font-game">HappiCat Hideout</h1>
              <div className="divider"></div>
              {/* Pass setWalletAddress as a prop to WalletConnector */}
              <WalletConnector setWalletAddress={setWalletAddress} />
              {/* Render Tamagotchi NFTs */}
              <ul>
                {tamagotchiNFTs.map((nft, index) => (
                  <li key={index}>{/* Display NFT information */}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
