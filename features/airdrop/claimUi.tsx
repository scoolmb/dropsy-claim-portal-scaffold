import { UiWalletAccount } from "@wallet-standard/react";
import React from "react";
import { useClaimAirdrop } from "./use-claim-airdrop";
import { Button } from "@/components/ui/button";
import { useTransactionBuilder } from "../solana/use-build-sign-transaction";
import { useSolana } from "@/lib/context/solana-provider";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { Account, address } from "@solana/kit";
import {
  Airdrop,
  ClaimAirdropAsyncInput,
  fetchAirdropMaster,
} from "@dropsy/airdrop";
import { getClaimProof } from "@/lib/helper/merkle";
import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { toast } from "sonner";
import { DROPSY_TREASURY_ADDRESS } from "@/lib/constants";

const ClaimUi = ({
  data: airdropData,
  account,
  entry,
}: {
  data: Account<Airdrop, string> | undefined;
  account: UiWalletAccount;
  entry: {
    address: string;
    amount: number;
    proof: string[];
    index: number;
  };
}) => {
  const { mutateAsync: claimAirdrop } = useClaimAirdrop();
  const { chain, rpc } = useSolana();
  const { mutateAsync: sendTx } = useTransactionBuilder();
  const signer = useWalletAccountTransactionSendingSigner(account, chain);
  const AIRDROP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;
  const MINT_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS;
  const AIRDROP_MASTER = process.env.NEXT_PUBLIC_AIRDROP_MASTER;
  const BITMAP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_BITMAP_ADDRESS;

  const onSubmit = async () => {
    if (!airdropData) {
      toast.error("Airdrop data is not available");
      return;
    }
    if (!rpc) {
      toast.error("RPC is not available");
      return;
    }
    if (!signer) {
      toast.error("Signer is not available");
      return;
    }
    console.log("Claiming airdrop for entry:", airdropData?.data.master);
    if (
      !MINT_ADDRESS ||
      !AIRDROP_ADDRESS ||
      !AIRDROP_MASTER ||
      !BITMAP_ADDRESS
    ) {
      toast.error("env error");
      return;
    }
    const mint = address(MINT_ADDRESS);
    const proof = getClaimProof(entry.proof);
    const airdropMasterAccount = await fetchAirdropMaster(
      rpc,
      address(airdropData?.data.master),
    );
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
      airdropId: airdropData ? airdropData.data.id : 1,
      sourceTokenAccount,
      mint: mint,
      treasury: airdropMasterAccount.data.treasury,
      protocolTreasury: DROPSY_TREASURY_ADDRESS,
      masterCreator: airdropMasterAccount.data.creator,
      airdrop: address(AIRDROP_ADDRESS),

      authority: airdropData?.data.authority,
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
