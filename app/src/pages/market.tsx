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

      // Fetch the last feed date from the Solana blockchain using the token ID
      const tokenPublicKey = new PublicKey(tokenId);
      const lastFeedDate = await fetchLastFeedDate(tokenPublicKey);
      if (lastFeedDate !== null) {
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        const days = Math.floor((currentTime - lastFeedDate) / (24 * 3600));
        setDaysElapsed(days);
      } else {
        setDaysElapsed(null); // Handle error case if token ID doesn't exist or there's an issue fetching data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDaysElapsed(null); // Handle error case
    } finally {
      setLoading(false);
    }
  };

  const fetchLastFeedDate = async (
    tokenPublicKey: PublicKey
  ): Promise<number | null> => {
    // Replace this with your actual API endpoint to fetch the last feed date for the given token ID
    const apiUrl = `https://your-api-url.com/last-feed-date/${tokenPublicKey.toBase58()}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.lastFeedDate; // Assuming the response contains the last feed date
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Return null in case of error
    }
  };

  return (
    <div>
      <h1>Calculate Days Elapsed from Last Feed Date</h1>
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
    </div>
  );
};

export default Market;
