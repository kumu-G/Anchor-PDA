import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import type { Pda } from "../target/types/pda";

describe("pda", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Pda as anchor.Program<Pda>;
  
  // const program = program;
  const wallet = pg.wallet;

  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Create Message Account", async () => {
    const message = "Hello, World!";
    const transactionSignature = await program.methods
      .create(message)
      .accounts({
        messageAccount: messagePda,
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log(JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });

  it("Update Message Account", async () => {
    const message = "Hello, Solana!";
    const transactionSignature = await program.methods
      .update(message)
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log(JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });

  it("Delete Message Account", async () => {
    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetchNullable(
      messagePda,
      "confirmed"
    );

    console.log("Expect Null:", JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });
});
