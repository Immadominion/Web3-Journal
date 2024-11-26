"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";
import { AppHero } from "../ui/ui-layout";
import { useJournalProgram } from "./basic-data-access";
import { BasicAllEntries, BasicCreate, BasicProgram } from "./basic-ui";

export default function BasicFeature() {
  const { publicKey } = useWallet();
  const { getProgramAccount } = useJournalProgram();

  return (
    <div className="max-w-4xl mx-auto">
      {publicKey ? (
        <>
          <AppHero
            title="Journal Program"
            subtitle="Manage your journal entries securely on the blockchain."
          >
            <p className="mb-6 text-sm text-gray-600">
              Program ID:&nbsp; // In basic-feature.tsx
              <ExplorerLink
                path={`account/${getProgramAccount.data?.value?.owner.toString()}`}
                label={
                  getProgramAccount.data?.value?.owner.toString() ||
                  "Loading..."
                }
              />
            </p>
          </AppHero>
          <div className="space-y-6">
            <BasicCreate />
            <BasicProgram />
            <BasicAllEntries />
          </div>
        </>
      ) : (
        <div className="hero py-20 text-center">
          <h2 className="text-lg font-semibold mb-4">
            Connect your wallet to interact with the program
          </h2>
          <WalletButton className="btn btn-primary btn-lg" />
        </div>
      )}
    </div>
  );
}
