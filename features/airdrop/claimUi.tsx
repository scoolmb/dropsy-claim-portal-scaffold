import { UiWalletAccount } from "@wallet-standard/react";
import React from "react";
import { useClaimAirdrop } from "./use-claim-airdrop";
import { Button } from "@/components/ui/button";
import { useTransactionBuilder } from "../solana/use-build-sign-transaction";
import { useSolana } from "@/lib/context/solana-provider";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { address } from "@solana/kit";
import { ClaimAirdropAsyncInput } from "@dropsy/airdrop";
import { getClaimProof } from "@/lib/helper/merkle";
import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { toast } from "sonner";
import { DROPSY_TREASURY_ADDRESS } from "@/lib/constants";

const ClaimUi = ({
  account,
  entry,
}: {
  account: UiWalletAccount;
  entry: {
    address: string;
    amount: number;
    proof: string[];
    index: number;
  };
}) => {
  const { mutateAsync: claimAirdrop } = useClaimAirdrop();
  const { chain } = useSolana();
  const { mutateAsync: sendTx } = useTransactionBuilder();
  const signer = useWalletAccountTransactionSendingSigner(account, chain);
  const AIRDROP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;
  const MINT_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS;
  const AIRDROP_MASTER = process.env.NEXT_PUBLIC_AIRDROP_MASTER;
  const AIRDROP_MASTER_TREASURY =
    process.env.NEXT_PUBLIC_AIRDROP_MASTER_TREASURY;
  const AIRDROP_MASTER_CREATOR = process.env.NEXT_PUBLIC_AIRDROP_MASTER_CREATOR;
  const AIRDROP_AUTHORITY = process.env.NEXT_PUBLIC_AIRDROP_CREATOR_ADDRESS;
  const BITMAP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_BITMAP_ADDRESS;

  const onSubmit = async () => {
    if (
      !MINT_ADDRESS ||
      !AIRDROP_ADDRESS ||
      !AIRDROP_MASTER ||
      !AIRDROP_MASTER_TREASURY ||
      !AIRDROP_MASTER_CREATOR ||
      !AIRDROP_AUTHORITY ||
      !BITMAP_ADDRESS
    ) {
      toast.error("env error");
      return;
    }
    const mint = address(MINT_ADDRESS);
    const proof = getClaimProof(entry.proof);
    const [destinationTokenAccount, destBump] = await findAssociatedTokenPda({
      owner: signer.address,
      mint: mint,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const [sourceTokenAccount, sourceATABump] = await findAssociatedTokenPda({
      owner: address(AIRDROP_ADDRESS),
      mint: mint,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    if (!proof) return;
    const data: ClaimAirdropAsyncInput = {
      sourceTokenAccount,
      mint: address(MINT_ADDRESS),
      treasury: address(AIRDROP_MASTER_TREASURY),
      protocolTreasury: DROPSY_TREASURY_ADDRESS,
      masterCreator: address(AIRDROP_MASTER_CREATOR),
      airdrop: address(AIRDROP_ADDRESS),

      authority: address(AIRDROP_AUTHORITY),
      bitmap: address(BITMAP_ADDRESS),
      claimMapIndex: 0,
      index: entry.index,
      amount: entry.amount,
      proof,
      claimer: signer,
    };

    const instructions = await claimAirdrop(data);

    await sendTx({ instructions, signer });
  };

  return <Button onClick={onSubmit}>CLaim Airdrop Now</Button>;
};

export default ClaimUi;
