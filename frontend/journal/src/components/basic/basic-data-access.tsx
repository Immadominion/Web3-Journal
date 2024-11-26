"use client";

import {
  PROGRAM_ADDRESS as programId,
  INSTRUCTIONS,
} from "../../../anchor/src/basic-exports";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Program, AnchorProvider } from "@project-serum/anchor";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { IDL } from "../../../../../anchor_project/journal/target/types/journal"; // Make sure to import your IDL

export function useJournalProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const getAllEntries = useQuery({
    queryKey: [
      "get-all-entries",
      { cluster, owner: provider?.publicKey?.toString() },
    ],
    queryFn: async () => {
      if (!provider?.publicKey) throw new Error("Wallet not connected");

      const program = getProgram();
      const accounts = await program.account.journalEntryState.all([
        {
          memcmp: {
            offset: 8, // Offset of the `owner` field in the account data structure
            bytes: provider.publicKey.toBase58(),
          },
        },
      ]);

      return accounts.map((account) => ({
        publicKey: account.publicKey.toString(),
        data: account.account,
      }));
    },
  });

  // Create program instance
  const getProgram = () => {
    if (!provider) throw new Error("Provider not found");
    return new Program(IDL, new PublicKey(programId), provider);
  };

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(new PublicKey(programId)),
  });

  const createEntry = useMutation<
    string,
    Error,
    { title: string; message: string; owner: PublicKey }
  >({
    mutationKey: ["journalEntry", "create", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        new PublicKey(programId)
      );

      // Check if account exists
      const accountInfo = await connection.getAccountInfo(journalEntryAddress);
      if (accountInfo) {
        throw new Error("A journal entry with this title already exists");
      }

      const program = getProgram();

      return program.methods
        .createJournalEntry(title, message)
        .accounts({
          journalEntry: journalEntryAddress,
          owner,
          systemProgram: PublicKey.default,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      getProgramAccount.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create journal entry: ${error.message}`);
    },
  });

  const updateEntry = useMutation<
    string,
    Error,
    { title: string; message: string; owner: PublicKey }
  >({
    mutationKey: ["journalEntry", "update", { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        new PublicKey(programId)
      );

      const program = getProgram();

      return program.methods
        .updateJournalEntry(title, message)
        .accounts({
          journalEntry: journalEntryAddress,
          owner,
          systemProgram: PublicKey.default,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      getProgramAccount.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update journal entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation<
    string,
    Error,
    { title: string; owner: PublicKey }
  >({
    mutationKey: ["journal", "deleteEntry", { cluster }],
    mutationFn: async ({ title, owner }) => {
      const [journalEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        new PublicKey(programId)
      );

      const program = getProgram();

      return program.methods
        .deleteJournalEntry(title)
        .accounts({
          journalEntry: journalEntryAddress,
          owner,
          systemProgram: PublicKey.default,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      getProgramAccount.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete journal entry: ${error.message}`);
    },
  });

  return {
    getProgramAccount,
    createEntry,
    updateEntry,
    deleteEntry,
    getAllEntries, // Add this
  };
}
