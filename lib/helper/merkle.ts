import { MerkleTree } from "merkletreejs";
import { sha256 } from "@noble/hashes/sha2";
import {  getBase58Codec } from "@solana/kit";
import { createHash } from "crypto";

export function hashAddress(address: string): Buffer {
    const base58Codec = getBase58Codec();
  const walletBytes: Uint8Array = base58Codec.encode(address) as Uint8Array; // decode base58 to raw 32 bytes
  return Buffer.from(sha256(walletBytes)); // hash the raw bytes
}
export function hashWalletLeaf(
  index: number,
  wallet: string,
  amount: number
): Buffer {
  // Must match Rust exactly
  const data = `${index}:${wallet}:${amount}`;

  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);

  return Buffer.from(sha256(bytes));
}

export function buildWLMerkleTree(addresses: string[]) {
    const leaves = addresses.map(hashLeaf);
    const tree = new MerkleTree(leaves, sha256, {
        sortPairs: true,
    });

    return {
        tree,
        root: tree.getRoot().toString("hex"),
    };
}

export function buildClaimMerkleTree(leaves: Buffer<ArrayBufferLike>[]) {
    const tree = new MerkleTree(leaves, sha256, {
        sortPairs: true,
    });

    return {
        tree,
        root: tree.getRoot().toString("hex"),
    };
}

export function getDiscountProof(
  discountData: any, 
  walletAddress: string
): Uint8Array[] | null {
  // 1. Find the proof entry
  const discountEntry = discountData?.proofs?.find(
    (p: any) => p.address === walletAddress,
  );
  
  if (!discountEntry?.proof) {
    return null;
  }

  // 2. Validate proof is an array
  if (!Array.isArray(discountEntry.proof)) {
    throw new Error('Proof must be an array');
  }

  // 3. Convert each hex string to Uint8Array
  const proofArray: Uint8Array[] = [];
  
  for (const hex of discountEntry.proof) {
    if (typeof hex !== 'string') {
      throw new Error('Each proof element must be a hex string');
    }
    
    // Convert hex to Uint8Array (works in both browser and Node.js)
    const bytes = hexToUint8Array(hex);
    
    if (bytes.length !== 32) {
      throw new Error(`Invalid proof length: ${bytes.length}, expected 32`);
    }
    
    proofArray.push(bytes);
  }

  return proofArray;
}

export function getClaimProof(
  proof: string[]
): Uint8Array[] | null {


  // 3. Convert each hex string to Uint8Array
  const proofArray: Uint8Array[] = [];
  
  for (const hex of proof) {
    if (typeof hex !== 'string') {
      throw new Error('Each proof element must be a hex string');
    }
    
    // Convert hex to Uint8Array (works in both browser and Node.js)
    const bytes = hexToUint8Array(hex);
    
    if (bytes.length !== 32) {
      throw new Error(`Invalid proof length: ${bytes.length}, expected 32`);
    }
    
    proofArray.push(bytes);
  }

  return proofArray;
}


function hexToUint8Array(hex: string): Uint8Array {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  // Validate hex string
  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error('Invalid hex string');
  }
  
  if (cleanHex.length !== 64) { // 32 bytes = 64 hex characters
    throw new Error(`Hex string must be 64 characters for 32 bytes, got ${cleanHex.length}`);
  }
  
  const bytes = new Uint8Array(cleanHex.length / 2);
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  
  return bytes;
}

export const getMerkleProof = (
  merkleTree: MerkleTree,
  address: string,
): number[][] => {
  const leaf = hashLeaf(address);
  const proof = merkleTree.getProof(leaf);

  return proof.map((p) => Array.from(p.data));
};

function hashLeaf(address: string): Buffer {
  const bytes = new TextEncoder().encode(address); 
  return Buffer.from(sha256(bytes));                                       
}


