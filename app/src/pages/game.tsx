import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

// Assuming you have imported your Solana program here
import { feed, burn } from "./your_program_file_name";

const NftPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [lastFeedDate, setLastFeedDate] = useState<number | null>(null);
  const [art, setArt] = useState<string>("");

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

      const dataBuffer = Buffer.from(nftDataAccountInfo.data);
      const lastFeedDate = dataBuffer.readUInt32LE(0);
      setLastFeedDate(lastFeedDate);

      const oneDayInSeconds = 24 * 60 * 60;
      const daysSinceLastFeed = Math.floor(
        (Date.now() / 1000 - lastFeedDate) / oneDayInSeconds
      );
      switch (daysSinceLastFeed) {
        case 1:
          setArt(
            <div className="art">
              <div className="lcd">
                <div className="line">•⩊• happi, no hungry ''</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚☽˚｡</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚</div>
                <div className="line">?</div>
                <div className="line">╱|、</div>
                <div className="line">(˚ˎ 。7</div>
                <div className="line">|、</div>
                <div className="line">じしˍ,)ノ</div>
                <br></br>
                <div class="line">────⋆⋅☆⋅⋆── ────⋆⋅☆⋅⋆──</div>
              </div>
            </div>
          );
          break;
        case 2:
          setArt(
            <div className="art">
              <div className="lcd">
                <div className="line">•⩊• little hungry here ''</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚☽˚｡</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚</div>
                <div className="line">?</div>
                <div className="line">╱|、</div>
                <div className="line">(˚ˎ 。7</div>
                <div className="line">|、</div>
                <div className="line">じしˍ,)ノ</div>
                <br></br>
                <div class="line">────⋆⋅☆⋅⋆── ────⋆⋅☆⋅⋆──</div>
              </div>
            </div>
          );
          break;
        case 3:
          setArt(
            <div className="art">
              <div className="lcd">
                <div className="line">•⩊• feed me now :( ''</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚☽˚｡</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚</div>
                <div className="line">?</div>
                <div className="line">╱|、</div>
                <div className="line">(˚ˎ 。7</div>
                <div className="line">|、</div>
                <div className="line">じしˍ,)ノ</div>
                <br></br>
                <div class="line">────⋆⋅☆⋅⋆── ────⋆⋅☆⋅⋆──</div>
              </div>
            </div>
          );
          break;
        default:
          try {
            await burn();
            console.log("Burn successful");
          } catch (error) {
            console.error("Error burning:", error);
          }
          setArt(
            <div className="art">
              <div className="lcd">
                <div className="line">•⩊• noo, you cant feed me anymore ''</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚☽˚｡</div>
                <div className="line">⋆｡˚ ☁︎ ˚｡⋆｡˚</div>
                <div className="line">?</div>
                <div className="line">╱|、</div>
                <div className="line">(˚ˎ 。7</div>
                <div className="line">|、</div>
                <div className="line">じしˍ,)ノ</div>
                <br></br>
                <div class="line">────⋆⋅☆⋅⋆── ────⋆⋅☆⋅⋆──</div>
              </div>
            </div>
          );
      }
    };

    checkNftPresenceAndLastFeedDate();

    return () => {};
  }, [publicKey, router]);

  const handlePet = async () => {
    try {
      await feed();
      console.log("Pet successful");
      setLastFeedDate(Date.now() / 1000);
    } catch (error) {
      console.error("Error petting:", error);
    }
  };

  return (
    <div>
      <h1>NFT Page</h1>
      {publicKey && (
        <div>
          <h2>{publicKey?.toBase58()}</h2>
          {lastFeedDate !== null && (
            <div>
              <p>Last feed: {lastFeedDate}</p>
              {art && (
                <div>
                  <pre>{art}</pre>
                  <button onClick={handlePet}>Pet</button>{" "}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NftPage;
