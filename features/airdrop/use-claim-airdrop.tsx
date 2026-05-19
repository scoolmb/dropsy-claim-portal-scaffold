import { useMutation } from "@tanstack/react-query";
import { Instruction } from "@solana/kit";
import {
  ClaimAirdropAsyncInput,
  getClaimAirdropInstructionAsync,
} from "@dropsy/airdrop";

export function useClaimAirdrop() {
  return useMutation<Instruction[], Error, ClaimAirdropAsyncInput>({
    mutationFn: async (input: ClaimAirdropAsyncInput) => {
      const ix = await getClaimAirdropInstructionAsync(input);
      const instructions = [ix];
      return instructions;
    },
  });
}
