import { useQuery } from "@tanstack/react-query";

interface ClaimEntry {
  index: number;
  address: string;
  amount: number;
  proof: string[];
}

async function checkEligibility(address: string): Promise<ClaimEntry | null> {
  const res = await fetch("/claim-merkle.json");
  const data = await res.json();

  const found = data.proofs.find(
    (entry: ClaimEntry) => entry.address === address,
  );

  return found ?? null;
}

export function useCheckEligibility(address?: string) {
  return useQuery({
    queryKey: ["eligibility", address],
    queryFn: () => checkEligibility(address!),
    enabled: !!address,
  });
}
