import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

const Market: React.FC = () => {
  const { publicKey } = useWallet();
  const [tokenId, setTokenId] = useState("");
  const [daysElapsed, setDaysElapsed] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      setLoading(true);

      const tokenPublicKey = new PublicKey(tokenId);
      const lastFeedDate = await fetchLastFeedDate(tokenPublicKey);
      if (lastFeedDate !== null) {
        const currentTime = Date.now() / 1000;
        const days = Math.floor((currentTime - lastFeedDate) / (24 * 3600));
        setDaysElapsed(days);
      } else {
        setDaysElapsed(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDaysElapsed(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastFeedDate = async (
    tokenPublicKey: PublicKey
  ): Promise<number | null> => {
    const apiUrl = `https://your-api-url.com/last-feed-date/${tokenPublicKey.toBase58()}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.lastFeedDate;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleBuy = async () => {
    try {
      console.log("Buy button clicked");
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  return (
    <div>
      <h1>Marketplace</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Token ID:
          <input type="text" value={tokenId} onChange={handleChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Calculate"}
        </button>
      </form>
      {daysElapsed !== null && (
        <p>Days Elapsed from Last Feed Date: {daysElapsed}</p>
      )}
      <div>
        <h2>NFT for Sale</h2>
        <div>
          <p>NFT Name</p>
          <p>NFT Description</p>
          <p>NFT Price</p>
          <button onClick={handleBuy}>Buy</button>
        </div>
      </div>
    </div>
  );
};

export default Market;
