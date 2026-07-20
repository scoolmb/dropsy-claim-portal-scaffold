import React from "react";
import { useSolana } from "../lib/context/solana-provider";
import { AuthWalletGate } from "./auth-gate";
import ClaimUi from "@/features/airdrop/claimUi";
import { useCheckEligibility } from "@/features/airdrop/use-check-eligibility";
import { Airdrop } from "@dropsy/airdrop";
import { Account } from "@solana/kit";

const ClaimCard: React.FC<{
  data: Account<Airdrop, string> | undefined;
}> = ({ data }) => {
  const { selectedAccount } = useSolana();
  const { data: eligibilityResult, isLoading: eligibilityLoading } =
    useCheckEligibility(selectedAccount?.address);

  return (
    <div className="space-y-6">
      {!selectedAccount && (
        <p className="text-sm text-center text-gray-500">
          Please connect your wallet to check eligibility.
        </p>
      )}
      {eligibilityLoading && (
        <p className="text-sm text-gray-500">Checking eligibility...</p>
      )}
      {/* Results Display */}
      <div
        className={`mt-8 p-6 rounded-lg ${
          eligibilityResult
            ? "bg-green-50 border border-green-200"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              eligibilityResult
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {eligibilityResult ? "✓" : "×"}
          </div>

          <div className="flex-1">
            <h3
              className={`text-lg font-semibold mb-2 ${
                eligibilityResult ? "text-green-800" : "text-gray-800"
              }`}
            >
              {eligibilityResult
                ? "Wallet is Eligible!"
                : "Wallet is Not Eligible"}
            </h3>

            {eligibilityResult ? (
              <>
                <p className="text-green-700 mb-2">
                  Claimable Amount:{" "}
                  <span className="font-bold text-xl">
                    {eligibilityResult.amount} Tokens
                  </span>
                </p>

                {/* Claim Button 
                  <button className="mt-4 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105">
                    Claim {eligibilityResult.amount} Tokens
                  </button>*/}
                <AuthWalletGate>
                  {(account) => (
                    <ClaimUi
                      account={account}
                      entry={eligibilityResult}
                      data={data}
                    />
                  )}
                </AuthWalletGate>
              </>
            ) : (
              <p className="text-gray-600">
                This wallet address is not eligible for the current claim
                period.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
