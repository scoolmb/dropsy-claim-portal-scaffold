// app/claim-airdrop/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Wallet,
  Gift,
  Calendar,
  Coins,
  Sparkles,
} from "lucide-react";

// Mock wallet address - in real app, this would come from wallet connection
const MOCK_WALLET_ADDRESS = "0xA1B2...C3D4E5";

export default function ClaimAirdropPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsClaiming(false);
    setHasClaimed(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header / Dashboard Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Badge
            variant="secondary"
            className="bg-purple-600/20 text-purple-300"
          >
            Claim Airdrop
          </Badge>
        </div>

        {/* Main Claim Card */}
        <AirdropClaimCard
          onClaim={handleClaim}
          isClaiming={isClaiming}
          hasClaimed={hasClaimed}
          walletAddress={MOCK_WALLET_ADDRESS}
        />

        {/* Airdrop Overview Section */}
        <AirdropOverviewCard />

        {/* Eligibility Status Card */}
        <EligibilityStatusCard />

        {/* Eligible Amount Card */}
        <EligibleAmountCard />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}

// ==================== COMPONENTS ====================

interface AirdropClaimCardProps {
  onClaim: () => void;
  isClaiming: boolean;
  hasClaimed: boolean;
  walletAddress: string;
}

function AirdropClaimCard({
  onClaim,
  isClaiming,
  hasClaimed,
  walletAddress,
}: AirdropClaimCardProps) {
  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-white">
          <Gift className="h-6 w-6 text-purple-400" />
          Claim Your Airdrop
        </CardTitle>
        <CardDescription className="text-slate-400">
          Click the button below to claim your airdrop tokens to your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-400">
            Wallet Address
          </p>
          <div className="flex items-center gap-2 font-mono text-lg text-white">
            <Wallet className="h-5 w-5 text-purple-400" />
            {walletAddress}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onClaim}
          disabled={isClaiming || hasClaimed}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 disabled:opacity-50"
        >
          {isClaiming ? (
            <>Processing...</>
          ) : hasClaimed ? (
            <>Already Claimed ✓</>
          ) : (
            <>Claim 250 DCT</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AirdropOverviewCard() {
  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Airdrop Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="mb-1 text-sm text-slate-400">Airdrop Campaign</p>
            <p className="text-lg font-semibold text-white">Season 1 Airdrop</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="mb-1 text-sm text-slate-400">Total Allocation</p>
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-purple-400" />
              <p className="text-lg font-semibold text-white">100,000 DCT</p>
            </div>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="mb-1 text-sm text-slate-400">Claim Period</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-purple-400" />
              <p className="text-sm font-medium text-white">
                May 01, 2024 - May 31, 2024
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EligibilityStatusCard() {
  return (
    <Card className="border-green-500/30 bg-gradient-to-br from-slate-900 to-green-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          Eligibility Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">You are eligible!</p>
            <p className="text-sm text-slate-300">
              You are eligible to claim the airdrop.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EligibleAmountCard() {
  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900 to-purple-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          Eligible Amount
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 rounded-lg bg-purple-500/10 p-4">
          <span className="text-4xl font-bold text-white">250</span>
          <span className="text-xl font-semibold text-purple-400">DCT</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="py-4 text-center">
      <p className="text-sm text-slate-500">Powered by Dropsy</p>
    </footer>
  );
}
