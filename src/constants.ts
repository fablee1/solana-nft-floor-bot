import { Keypair, PublicKey } from "@solana/web3.js"
import bs58 from "bs58"

export const MyKeyPair = Keypair.fromSecretKey(
  new Uint8Array(bs58.decode(process.env.MY_PRIV_KEY!))
)

// Constants defined by DE
export const EscrowTaxRecipient = new PublicKey(
  "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu"
)
export const SomeDefault1ConstantPubKey = new PublicKey(
  "11111111111111111111111111111111"
)
export const TokenProgramPubKey = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
)
export const AnotherConstantPubKey = new PublicKey(
  "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr"
)
export const EscrowProgramPubKey = new PublicKey(
  "A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7"
)
export const SecondTokenProgramPubKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)
export const SysvarRentPubKey = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
)
export const metaDataTokens = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
