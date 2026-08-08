import { useQuery } from "@tanstack/react-query";
import {
  Account,
  address,
  Address,
  assertAccountExists,
  createSolanaRpc,
} from "@solana/kit";

import { Airdrop, fetchMaybeAirdrop } from "@dropsy/airdrop";
export function useFetchAirdrop(rpc: ReturnType<typeof createSolanaRpc>) {
  const enabled = Boolean(rpc);

  return useQuery<Account<Airdrop, string>>({
    queryKey: ["airdrop"],
    enabled,

    queryFn: async () => {
      if (!rpc) {
        throw new Error("RPC is not available");
      }
      if (!process.env.NEXT_PUBLIC_AIRDROP_ADDRESS) {
        throw new Error("Airdrop address is not set in environment variables");
      }
      const airdropPda = address(process.env.NEXT_PUBLIC_AIRDROP_ADDRESS);

      const account = await fetchMaybeAirdrop(rpc, airdropPda);

      assertAccountExists(account);

      return account;
    },
  });
}
