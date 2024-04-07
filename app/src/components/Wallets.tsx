import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

const WalletConnector = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();

  const supportedWallets = wallets.filter(
    (wallet) => wallet.readyState === "Installed"
  );

  return !publicKey ? (
    <div>
      {supportedWallets.length > 0 ? (
        supportedWallets.map((wallet) => (
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
        <h2>Please install a compatible wallet</h2>
      )}
    </div>
  ) : (
    <div>
      <h2>Connected</h2>
      <div className="divider"></div>
      <div className="flex flex-col items-center gap-4">
        <button className="btn btn-outline btn-accent" onClick={disconnect}>
          Disconnect wallet
        </button>
        <Link href="/game" className="btn btn-primary">
          Proceed
        </Link>
      </div>
    </div>
  );
};

export default WalletConnector;
