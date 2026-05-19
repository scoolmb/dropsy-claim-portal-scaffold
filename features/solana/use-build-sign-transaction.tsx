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

/*export function useTransactionBuilder() {
  const { rpc } = useSolana();

  return useMutation<Signature, TxThrownError, Props>({
    mutationFn: async ({ instructions, signer }) => {
      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (m) => setTransactionMessageFeePayerSigner(signer, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) => appendTransactionMessageInstructions(instructions, m),
      );

      try {
        const transaction = compileTransaction(message);
        const base64TX = getBase64EncodedWireTransaction(transaction);
        let simulateTxConfig = {
          commitment: "finalized",
          encoding: "base64",
          replaceRecentBlockhash: true,
          sigVerify: false,
          minContextSlot: undefined,
          innerInstructions: undefined,
          accounts: undefined,
        };

        let simulateResult = await rpc
          .simulateTransaction(base64TX, simulateTxConfig)
          .send();
        if (simulateResult.value.err) {
          toast.error(
            "Error While Simulating Transaction : " + simulateResult.value.err,
          );
        } else {
        }
      } catch (error) {
        toast.error("Unexpected Error Occured while simulating");
      }

      try {
        const signature =
          await signAndSendTransactionMessageWithSigners(message);
        return getBase58Decoder().decode(signature) as Signature;
      } catch (error) {
        if (isDropsyError(error, message)) {
          const code = error.context.code as DropsyError;
          console.log("Error code :", code, error.message);
          //return error.message; //getDropsyErrorMessage(code);
        }
        throw { error, message };
      }
    },

    onSuccess(signature) {
      toast.success("Transaction sent", {
        description: `${signature.slice(0, 6)}…${signature.slice(-6)}`,
      });
    },

    onError(thrown) {
      const errorMessage = handleDropsyTxError(thrown);
      toast.error("Transaction failed", {
        description: errorMessage,
      });
    },
  });
}*/

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
            transactio : {signature.slice(0, 6)}…${signature.slice(-6)}
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
    console.log(value.logs);
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
