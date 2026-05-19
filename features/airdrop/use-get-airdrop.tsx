import { useQuery } from "@tanstack/react-query";
import {
  Account,
  Address,
  assertAccountExists,
  createSolanaRpc,
} from "@solana/kit";

import { Airdrop, fetchMaybeAirdrop } from "@dropsy/airdrop";
export function useFetchAirdrop(
  rpc: ReturnType<typeof createSolanaRpc>,
  address: Address | null,
) {
  const enabled = Boolean(rpc && address);

  return useQuery<Account<Airdrop, string>>({
    queryKey: ["airdrop", address?.toString()],
    enabled,

    queryFn: async () => {
      if (!rpc) {
        throw new Error("RPC is not available");
      }

      if (!address) {
        throw new Error("Airdrop address is missing");
      }

      const account = await fetchMaybeAirdrop(rpc, address);

      assertAccountExists(account);

      return account;
    },
  });
}
