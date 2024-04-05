import { useWallet } from "@solana/wallet-adapter-react";

const WalletConnector = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();

  return !publicKey ? (
    <div>
      {wallets.length > 0 ? (
        wallets.map((wallet) => (
          <div key={wallet.adapter.name}>
            <button
              className="btn btn-outline btn-accent"
              key={wallet.adapter.name}
              onClick={() => select(wallet.adapter.name)}
            >
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                width="24px"
                height="24px"
              ></img>
              {wallet.adapter.name}
            </button>
            <div className="divider"></div>
          </div>
        ))
      ) : (
        <h2>No compatible wallets detected</h2>
      )}
    </div>
  ) : (
    <div>
      <h2>{publicKey.toBase58()}</h2>
      <div className="divider"></div>
      <button className="btn btn-outline btn-accent" onClick={disconnect}>
        Disconnect wallet
      </button>
    </div>
  );
};

export default WalletConnector;
