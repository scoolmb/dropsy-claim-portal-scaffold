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

  const hasWallet = !!selectedAccount;
  const isEligible = !!eligibilityResult;
  return (
    <div className="space-y-6">
      {!hasWallet && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            Connect your wallet to check your eligibility.
          </p>
        </div>
      )}

      {hasWallet && eligibilityLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-blue-700">Checking eligibility...</p>
        </div>
      )}

      {hasWallet && !eligibilityLoading && (
        <div
          className={`rounded-lg border p-6 ${
            isEligible
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isEligible
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isEligible ? "✓" : "×"}
            </div>

            <div className="flex-1">
              <h3
                className={`text-lg font-semibold ${
                  isEligible ? "text-green-800" : "text-gray-800"
                }`}
              >
                {isEligible ? "Wallet is Eligible!" : "Wallet is Not Eligible"}
              </h3>

              {isEligible ? (
                <>
                  <p className="mt-2 text-green-700">
                    Claimable Amount:
                    <span className="ml-2 text-xl font-bold">
                      {eligibilityResult.amount} Tokens
                    </span>
                  </p>

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
                <p className="mt-2 text-gray-600">
                  This wallet is not eligible for the current airdrop.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimCard;
