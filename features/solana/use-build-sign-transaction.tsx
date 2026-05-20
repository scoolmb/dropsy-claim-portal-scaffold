import { useMutation } from "@tanstack/react-query";
import {
  Address,
  appendTransactionMessageInstructions,
  BlockhashLifetimeConstraint,
  compileTransaction,
  createSolanaRpc,
  createTransactionMessage,
  getBase58Decoder,
  getBase64EncodedWireTransaction,
  Instruction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  Signature,
  SignatureBytes,
  Transaction,
  TransactionSendingSignerConfig,
  TransactionWithLifetime,
} from "@solana/kit";

import { useSolana } from "@/lib/context/solana-provider";
import { toast } from "sonner";
import Link from "next/link";
import { parseAnchorError } from "@/lib/helper/error";

interface Props {
  instructions: Instruction[];
  signer: Readonly<{
    address: Address<string>;
    signAndSendTransactions(
      transactions: readonly (
        | Transaction
        | (Transaction & TransactionWithLifetime)
      )[],
      config?: TransactionSendingSignerConfig,
    ): Promise<readonly SignatureBytes[]>;
  }>;
}

export function useTransactionBuilder() {
  const { rpc } = useSolana();

  return useMutation<Signature, Error, Props>({
    mutationFn: async ({ instructions, signer }) => {
      const { value: blockhash } = await rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const message = buildTransactionMessage({
        instructions,
        signer,
        blockhash: blockhash,
      });

      // 1️⃣ Simulate
      try {
        await simulateTransaction({ rpc, message });
      } catch (err) {
        toast.error("Simulation failed");
        throw err;
      }

      // 2️⃣ Sign & send
      try {
        const sigBytes =
          await signAndSendTransactionMessageWithSigners(message);

        return getBase58Decoder().decode(sigBytes) as Signature;
      } catch (error) {
        console.error("Transaction failed", error);
        throw error;
      }
    },

    onSuccess(signature) {
      toast.success("Transaction sent", {
        description: (
          <Link
            href={`https://solscan.io/tx/${signature}?cluster=devnet`}
            target="_blanc"
          >
            transaction : {signature.slice(0, 6)}…${signature.slice(-6)}
          </Link>
        ),
      });
    },

    onError(error) {
      toast.error("Transaction failed", {
        description: error.message,
      });
    },
  });
}

function buildTransactionMessage({
  instructions,
  signer,
  blockhash,
}: {
  instructions: Instruction[];
  signer: Props["signer"];
  blockhash: BlockhashLifetimeConstraint;
}) {
  return pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(signer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
}

async function simulateTransaction({
  rpc,
  message,
}: {
  rpc: ReturnType<typeof createSolanaRpc>;
  message: any;
}) {
  const transaction = compileTransaction(message);
  const base64TX = getBase64EncodedWireTransaction(transaction);

  const { value } = await rpc
    .simulateTransaction(base64TX, {
      commitment: "finalized",
      encoding: "base64",
      replaceRecentBlockhash: true,
      sigVerify: false,
    })
    .send();

  if (value.err) {
    console.log("Simulation logs:", value.logs);
    const parsed = parseAnchorError(value.logs ?? []);

    if (parsed) {
      throw new Error(`[${parsed.number}] ${parsed.code}: ${parsed.message}`);
    }

    throw new Error(`Simulation failed: ${safeStringify(value.err)}`);
  }
}

function safeStringify(value: unknown) {
  return JSON.stringify(
    value,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    2,
  );
}
