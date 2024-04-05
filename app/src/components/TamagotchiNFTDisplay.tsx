import React, { useState } from "react";

const TamagotchiNFTDisplay = ({ nfts, onFeed }) => {
  const [isFeeding, setIsFeeding] = useState(false);

  // Function to get NFT image based on last feed date
  const getNFTImage = (lastFeedDate) => {
    const currentDate = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const daysElapsed = Math.floor((currentDate - lastFeedDate) / oneDay);

    if (daysElapsed >= 3) {
      return "/image4.png"; // Fourth image for more than 3 days elapsed
    } else {
      return `/image${daysElapsed + 1}.png`; // Images numbered 1 to 3 based on daysElapsed
    }
  };

  const handleFeed = async () => {
    setIsFeeding(true);
    try {
      // Call the feed function in the smart contract
      await onFeed();
      alert("fed");
    } catch (error) {
      console.error("Error feeding NFT:", error);
      alert("cannot feed");
    } finally {
      setIsFeeding(false);
    }
  };

  return (
    <div>
      {nfts.map((nft, index) => (
        <div key={index}>
          {/* Display NFT image */}
          <img
            src={getNFTImage(nft.last_feed_date)}
            alt="NFT"
            className="max-w-xs"
          />
          {/* Button to feed the NFT */}
          <button
            onClick={handleFeed}
            disabled={isFeeding}
            className="btn btn-primary"
          >
            {isFeeding ? "Feeding..." : "Feed NFT"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TamagotchiNFTDisplay;
