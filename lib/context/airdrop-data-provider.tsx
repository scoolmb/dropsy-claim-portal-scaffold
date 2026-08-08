"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Account, address } from "@solana/kit";

import { useSolana } from "@/lib/context/solana-provider";
import { useFetchAirdrop } from "@/features/airdrop/use-get-airdrop";
import { Airdrop, AirdropMaster } from "@dropsy/airdrop";
import { useFetchAirdropMaster } from "@/features/airdrop/use-get-airdrop-master";
import { QueryObserverResult } from "@tanstack/react-query";

interface AirdropContextValue {
  airdrop: Account<Airdrop, string> | undefined;
  master: Account<AirdropMaster, string> | undefined;

  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;

  refetch: () => Promise<QueryObserverResult<Account<Airdrop, string>, Error>>;
}

const AirdropContext = createContext<AirdropContextValue | null>(null);

export function AirdropProvider({ children }: { children: ReactNode }) {
  const { rpc } = useSolana();

  const query = useFetchAirdrop(rpc);
  const masterQuery = useFetchAirdropMaster(rpc);

  const value = useMemo(
    () => ({
      airdrop: query.data,
      master: masterQuery.data,
      isFetching: query.isLoading,
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
    }),
    [query],
  );

  return (
    <AirdropContext.Provider value={value}>{children}</AirdropContext.Provider>
  );
}

export function useAirdrop() {
  const context = useContext(AirdropContext);

  if (!context) {
    throw new Error("useAirdrop must be used within AirdropProvider");
  }

  return context;
}
