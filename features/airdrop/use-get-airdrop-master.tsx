import { useQuery } from "@tanstack/react-query";
import {
  Account,
  address,
  assertAccountExists,
  createSolanaRpc,
} from "@solana/kit";

import { AirdropMaster, fetchMaybeAirdropMaster } from "@dropsy/airdrop";

export function useFetchAirdropMaster(rpc: ReturnType<typeof createSolanaRpc>) {
  const enabled = Boolean(rpc);

  return useQuery<Account<AirdropMaster, string>>({
    queryKey: ["airdropMaster"],
    enabled,

    queryFn: async () => {
      if (!rpc) {
        throw new Error("RPC is not available");
      }
      if (!process.env.NEXT_PUBLIC_AIRDROP_MASTER) {
        throw new Error(
          "Airdrop master address is not set in environment variables",
        );
      }

      if (!process.env.NEXT_PUBLIC_AIRDROP_MASTER) {
        throw new Error("Airdrop master address is missing");
      }

      const account = await fetchMaybeAirdropMaster(
        rpc,
        address(process.env.NEXT_PUBLIC_AIRDROP_MASTER),
      );

      console.log("Fetched airdrop master account:", account);
      assertAccountExists(account);

      console.log("Fetched airdrop master account:", account);

      return account;
    },
  });
}
