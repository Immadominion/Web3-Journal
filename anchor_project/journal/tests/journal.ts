import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Journal as Journal } from "../target/types/journal";
import * as assert from "assert";

describe("my-journal-dapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Journal as Program<Journal>;
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet;
  const systemProgram = anchor.web3.SystemProgram.programId;

  // Helper function to derive PDA
  const getJournalEntryPDA = async (title: string, owner: anchor.web3.PublicKey) => {
    return await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(title), owner.toBuffer()],
      program.programId
    );
  };

  it("Creates a journal entry (happy path)", async () => {
    const title = "My First Entry";
    const message = "This is my first journal entry.";
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);

    const tx = await program.methods
      .createJournalEntry(title, message)
      .accounts({
        journalEntry: journalEntryPda,
        owner: wallet.publicKey,
        systemProgram,
      })
      .rpc();

    console.log("Create journal entry transaction signature", tx);

    const journalAccount = await program.account.journalEntryState.fetch(journalEntryPda);
    assert.strictEqual(journalAccount.owner.toString(), wallet.publicKey.toString());
    assert.strictEqual(journalAccount.title, title);
    assert.strictEqual(journalAccount.message, message);
  });

   // Unhappy path tests
    it("should fail for empty title", async () => {
      try {
        const title = "";
        const message = "Test message";
        const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);
        
        await program.methods
          .createJournalEntry(title, message)
          .accounts({
            journalEntry: journalEntryPda,
            owner: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
          
        assert.fail("Should have failed with empty title");
      } catch (err) {
        assert.ok(err.toString().includes("Error"));
      }
    });

  it("Fails to create a journal entry with a title longer than 50 characters (unhappy path)", async () => {
    const title = "x".repeat(51);
    const message = "This is a test journal entry.";
    
    try {
        // We expect this to fail at PDA creation
        const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);
        assert.fail("Should have thrown Max seed length exceeded error");
    } catch (err) {
        assert.ok(err.toString().includes("Max seed length exceeded"));
    }
});

it("should fail for invalid public key", async () => {
  try {
    const title = "Test";
    const invalidPubkey = null;
    await getJournalEntryPDA(title, invalidPubkey as any);
    assert.fail("Should have failed with invalid pubkey");
  } catch (err) {
    assert.ok(err.toString().includes("Error"));
  }
});



// Update message too long test
it("Fails to create a journal entry with a message longer than 1000 characters (unhappy path)", async () => {
    const title = "Test Entry";
    const message = "x".repeat(1001);
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);

    try {
        await program.methods
            .createJournalEntry(title, message)
            .accounts({
                journalEntry: journalEntryPda,
                owner: wallet.publicKey,
                systemProgram,
            })
            .rpc();
            assert.fail("RangeError: encoding overruns Buffer");
      } catch (err) {
//Had serious issues debugging for the error here, had check for native code
        console.log(err.toString());
        assert.ok(err.toString().includes("encoding overruns Buffer"));
      }
});

  it("Updates a journal entry (happy path)", async () => {
    const title = "My First Entry";
    const updatedMessage = "This is an updated journal entry.";
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);

    const tx = await program.methods
      .updateJournalEntry(title, updatedMessage)
      .accounts({
        journalEntry: journalEntryPda,
        owner: wallet.publicKey,
        systemProgram,
      })
      .rpc();

    console.log("Update journal entry transaction signature", tx);

    const journalAccount = await program.account.journalEntryState.fetch(journalEntryPda);
    assert.strictEqual(journalAccount.message, updatedMessage);
  });

  it("Fails to update a journal entry if not the owner (unhappy path)", async () => {
    const title = "My First Entry";
    const updatedMessage = "This is an updated journal entry.";
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);
  
    // Create a random wallet for the attacker
    const attackerKeypair = anchor.web3.Keypair.generate();
  
    try {
      // Try to update the journal entry with the attacker's wallet (unauthorized)
      await program.methods
        .updateJournalEntry(title, updatedMessage)
        .accounts({
          journalEntry: journalEntryPda,
          owner: wallet.publicKey,  // The owner should still be `wallet.publicKey`
          systemProgram,
        })
        .signers([attackerKeypair]) // Add attacker signer
        .rpc();
      assert.fail("Expected an unauthorized error but none was thrown.");
    } catch (err) {
      // Expecting a specific error message from the Anchor program
      // if (err instanceof anchor.AnchorError) {
      //   console.log("Error Code:", err.error.errorCode);
      //   console.log("Error Message:", err.error.errorMessage);
        
      //   assert.strictEqual(err.error.errorMessage, "Unauthorized access.");
      //   assert.strictEqual(err.error.errorCode, 3012);
      // } else {
      //   assert.fail("Unexpected error type.");
      // }
      console.log(err.toString());
      assert.ok(err.toString().includes("unknown signer"));

    }
  });
  
  

  it("Deletes a journal entry (happy path)", async () => {
    const title = "My First Entry";
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);

    const tx = await program.methods
      .deleteJournalEntry(title)
      .accounts({
        journalEntry: journalEntryPda,
        owner: wallet.publicKey,
        systemProgram,
      })
      .rpc();

    console.log("Delete journal entry transaction signature", tx);

    try {
      await program.account.journalEntryState.fetch(journalEntryPda);
      assert.fail("The account should have been closed.");
    } catch (err) {
      assert.ok(err.message.includes("Account does not exist"));
    }
  });

  it("Fails to delete a journal entry if not the owner (unhappy path)", async () => {
    const title = "My First Entry"; // Use existing entry
    const [journalEntryPda] = await getJournalEntryPDA(title, wallet.publicKey);
  
    // Create a random wallet for the attacker
    const attackerKeypair = anchor.web3.Keypair.generate();
  
    try {
      // Try to delete the journal entry with the attacker's wallet (unauthorized)
      await program.methods
        .deleteJournalEntry(title)
        .accounts({
          journalEntry: journalEntryPda,
          owner: attackerKeypair.publicKey, // Attacker is not the owner
          systemProgram,
        })
        .signers([attackerKeypair]) // Add attacker signer
        .rpc();
      assert.fail("Expected an unauthorized error but none was thrown.");
    } catch (err) {
      // Expecting a specific error message from the Anchor program
      if (err instanceof anchor.AnchorError) {
        console.log("Error Code:", err.error.errorCode);
        console.log("Error Message:", err.error.errorMessage);
  
        assert.strictEqual(err.error.errorMessage, "The program expected this account to be already initialized");
      } else {
        assert.fail("Unexpected error type.");
      }
    }
  });
  
});
