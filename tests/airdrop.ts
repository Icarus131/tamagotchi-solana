import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { happi_cat_nft } from "<put the anchor program path after compilation wherever you are running it>";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const mintAuthorityKeypairPath = "keypair.json";
const tokenMintAddress = "mint_addr";

const recipientAddresses = ["holder1", "holder2", "holder3"];

async function main() {
  try {
    const mintAuthorityKeypair = Keypair.fromSecretKey(
      require(mintAuthorityKeypairPath)
    );

    for (const recipientAddress of recipientAddresses) {
      const mintTx = await mintTokens(
        mintAuthorityKeypair,
        tokenMintAddress,
        10
      );
      console.log("Tokens minted:", mintTx);

      const sendTx = await sendTokens(
        mintAuthorityKeypair,
        tokenMintAddress,
        recipientAddress,
        10
      );
      console.log("Tokens sent:", sendTx);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function mintTokens(
  mintAuthorityKeypair: Keypair,
  tokenMintAddress: string,
  amount: number
): Promise<string> {
  const mintToInstruction = happi_cat_nft.mintHappiCatNft({
    accounts: {
      happiCatNft: tokenMintAddress,
      happiCatNftAccount: new PublicKey("account_addr"),
      authority: mintAuthorityKeypair.publicKey,
      tokenProgram: new PublicKey("token_addr"),
    },
  });

  const transaction = new Transaction().add(mintToInstruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    mintAuthorityKeypair,
  ]);
  return signature;
}

async function sendTokens(
  mintAuthorityKeypair: Keypair,
  tokenMintAddress: string,
  recipientAddress: string,
  amount: number
): Promise<string> {
  const transferInstruction = happi_cat_nft.transferHappiCatNft({
    accounts: {
      from: new PublicKey("from_addr"),
      to: new PublicKey(recipientAddress),
      fromAuthority: mintAuthorityKeypair.publicKey,
      tokenProgram: new PublicKey("token_addr"),
    },
  });

  const transaction = new Transaction().add(transferInstruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    mintAuthorityKeypair,
  ]);
  return signature;
}

main();
