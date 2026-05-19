"use client";

import React from "react";
import { useSolana } from "@/lib/context/solana-provider";
import { WalletConnectButton } from "./wallet-connect-button";

import { Card, CardDescription, CardTitle } from "./ui/card";

interface AuthGateProps<T = any> {
  children: (account: T) => React.ReactNode;
  fallback?: React.ReactNode;
}

const ConnectionCard = ({
  title = "Wallet Required",
  description = "Connect your wallet to access this feature",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <Card className=" flex flex-col items-center justify-center p-8 min-h-72">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between space-y-4 ">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <h3 className="text-lg font-medium ">{title}</h3>
              <p className="text-sm">{description}</p>
            </div>
          </div>

          {/* Button Container */}
          <div className="flex justify-center items-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </Card>
  );
};

export function AuthWalletGate({ children, fallback }: AuthGateProps) {
  const { selectedAccount, isConnected } = useSolana();

  if (!isConnected || !selectedAccount) {
    return (
      <>
        {fallback ?? (
          <Card className="flex justify-center items-center-safe">
            <CardTitle>Wallet Required</CardTitle>
            <CardDescription>
              Connect your wallet to access this feature
            </CardDescription>

            <WalletConnectButton />
          </Card>
        )}
      </>
    );
  }

  return <>{children(selectedAccount)}</>;
}
