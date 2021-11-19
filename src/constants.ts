import { Keypair, PublicKey } from "@solana/web3.js"
import bs58 from "bs58"

export const MY_KEY_PAIR = Keypair.fromSecretKey(
  new Uint8Array(bs58.decode(process.env.MY_PRIV_KEY!))
)

// Common constants
export const TOKEN_PROGRAM_PUBKEY = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
)
export const SYSVAR_RENT_PUBKEY = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
)
export const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111")
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)
export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

// Constants definde by SolanArt
export const SomeSolanArtPubKey = new PublicKey(
  "7gDpaG9kUXHTz1dj4eVfykqtXnKq2efyuGigdMeCy74B"
)
export const AnotherSolanArtPubKey = new PublicKey(
  "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz"
)

// Constants defined by DE
export const EscrowTaxRecipient = new PublicKey(
  "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu"
)
export const AnotherConstantPubKey = new PublicKey(
  "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr"
)
export const EscrowProgramPubKey = new PublicKey(
  "A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7"
)
