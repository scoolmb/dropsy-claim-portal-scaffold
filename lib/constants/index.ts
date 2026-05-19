import { Address, address } from "@solana/kit";

/**
 * -------------------------
 * PDA Seed Constants
 * -------------------------
 * Used for deriving program addresses (PDAs) in Dropsy
 */

export const DROPSY_TREASURY_ADDRESS =
  "6TMmpVof9fGXak2VUgP4X9sXNfPHA7XWyi9ZMUCrHP6A" as Address<"6TMmpVof9fGXak2VUgP4X9sXNfPHA7XWyi9ZMUCrHP6A">;

export const DROPSY_MASTER_SEED = "master";
export const AIRDROP_CONFIG_SEED = "airdrop_config";
export const AFFILIATE_MASTER_SEED = "affiliate_master";
export const AIRDROP_MASTER_SEED = "airdrop_master";

export const AIRDROP_SEED = "airdrop";
export const AFFILIATE_SEED = "affiliate";
export const BITMAP_SEED = "bitmap";
export const VESTING_SEED = "vesting";

export const PRESALE_SEED = "presale";
export const VAULT_SEED = "vault";

/**
 * -------------------------
 * Admin / Protocol Keys
 * -------------------------
 */
export const ADMIN = address("8mtUD2XrkNnTxnjCehZ4DEtTXeGR1yrepSEGhCaSj2kT");
export const DROPSY_TREASURY = address("8mtUD2XrkNnTxnjCehZ4DEtTXeGR1yrepSEGhCaSj2kT");
export const DEFAULT_MASTER_PDA = address("8mtUD2XrkNnTxnjCehZ4DEtTXeGR1yrepSEGhCaSj2kT");
export const DEFAULT_MASTER_PDA_AUTHORITY = address("8mtUD2XrkNnTxnjCehZ4DEtTXeGR1yrepSEGhCaSj2kT");

/**
 * -------------------------
 * Bitmap / Claim Config
 * -------------------------
 */
export const BITMAP_SIZE = 8000; // in bytes
export const MAX_BITMAP_CLAIM = BITMAP_SIZE * 8; // max number of claim slots


/**
 * -------------------------
 * Airdrop Versions
 * -------------------------
 */
export const VERSION_BASIC = 0; // BasicAirdrop (MVP)
export const VERSION_VESTED = 1; // Vested / advanced airdrop

/**
 * -------------------------
 * Airdrop State
 * -------------------------
 */
export const STATE_INITIALIZED = 0; // default
export const STATE_DELEGATED = 1; // airdrop is delegated
export const STATE_REDEEMED = 2; // airdrop tokens redeemed

/**
 * -------------------------
 * Mutability Flags
 * -------------------------
 */
export const MUTABLE_NONE = 0; // immutable
