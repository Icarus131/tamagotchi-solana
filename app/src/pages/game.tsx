import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

const NftPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [lastFeedDate, setLastFeedDate] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) {
      router.push("/"); // Redirect to the homepage if user is not connected
      return;
    }

    const connection = new Connection("https://api.mainnet-beta.solana.com");

    const checkNftPresenceAndLastFeedDate = async () => {
      // Replace this with the account address of the NFT containing the last_feed_date
      const nftDataAccountAddress = new PublicKey(
        "YOUR_NFT_DATA_ACCOUNT_ADDRESS"
      );

      // Fetch the NFT data containing the last_feed_date
      const nftDataAccountInfo = await connection.getAccountInfo(
        nftDataAccountAddress
      );
      if (!nftDataAccountInfo) {
        console.error("NFT data account not found");
        return;
      }

      // Parse the last_feed_date from the account data
      const dataBuffer = Buffer.from(nftDataAccountInfo.data);
      const lastFeedDate = dataBuffer.readUInt32LE(0); // Assuming last_feed_date is stored as a 32-bit little-endian integer
      setLastFeedDate(lastFeedDate);
    };

    checkNftPresenceAndLastFeedDate();

    // Cleanup function
    return () => {};
  }, [publicKey, router]);

  const handleBurnt = () => {
    //burn
  };

  const getFeedStatus = () => {
    if (lastFeedDate === null) return "Unknown";

    const oneDayInSeconds = 24 * 60 * 60;
    const daysSinceLastFeed = Math.floor(
      (Date.now() / 1000 - lastFeedDate) / oneDayInSeconds
    );

    if (daysSinceLastFeed === 1) return "One day";
    if (daysSinceLastFeed === 2) return "Two days";
    if (daysSinceLastFeed === 3) return "Three days";

    return "More than three days";
  };

  return (
    <div>
      <h1>NFT Page</h1>
      {publicKey && (
        <div>
          <h2>{publicKey?.toBase58()}</h2>
          {lastFeedDate !== null && (
            <div>
              <p>Last feed: {getFeedStatus()}</p>
              {lastFeedDate > 3 * 24 * 60 * 60 ? (
                <div>
                  <img src="/burnt_image.png" alt="Burnt" />
                  <button onClick={handleBurnt}>Burn</button>
                </div>
              ) : (
                <img
                  src={`/other_image_${getFeedStatus()
                    .toLowerCase()
                    .replace(/\s+/g, "_")}.png`}
                  alt="Other"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NftPage;
