"use client";

import ClaimCard from "@/component/claim-card";
import { useSolana } from "@/lib/context/solana-provider";
import { useAirdrop } from "@/lib/context/airdrop-data-provider";

interface ClaimEntry {
  index: number;
  address: string;
  amount: number;
  proof: string[];
}

export default function Home() {
  const { selectedAccount, rpc } = useSolana();
  const { airdrop, master, isLoading, error } = useAirdrop();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Claim Portal
          </h1>
          <p className="text-lg text-gray-600">
            Check your wallet eligibility and claim your tokens{" "}
            {master?.data.airdropCreationFee}
          </p>
        </div>

        <ClaimCard data={airdrop} />

        {
          /* Stats Card */
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                  Total Eligible Wallets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {airdrop?.address.toString() || "N/A"}
                </p>
                {master?.address.toString() || "N/A"}
              </div>
              {/*<div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Claimable</p>
                <p className="text-2xl font-bold text-gray-900">
                  {claimList.reduce((sum, entry) => sum + entry.amount, 0)}{" "}
                  Tokens
                </p>
              </div>*/}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
