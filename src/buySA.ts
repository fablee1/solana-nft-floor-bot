import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import {
  AnotherSolanArtPubKey,
  MY_KEY_PAIR,
  SomeSolanArtPubKey,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_PUBKEY,
} from "./constants"
import {
  createAssociatedTokenAccInstruction,
  findRpk,
  findZ,
  getPriceSA,
  getSolanartA,
  getSolanartS,
  getSolanartX,
  percentageChange,
} from "./utils"
import BN from "bn.js"
import { MAXIMUM_PRICE_PER_BUY } from "./config"

export const buySA = async ({
  escrowAdd,
  owner,
  mint,
  price,
}: {
  escrowAdd: string
  owner: string
  mint: string
  price: number
}) => {
  try {
    // Maximum price per buy, if more than maximum dont buy
    if (price > MAXIMUM_PRICE_PER_BUY) {
      return
    }

    // Get needed addresses for instructions
    const nftMintPubKey = new PublicKey(mint)

    const O = await findZ(nftMintPubKey)

    const x = await getSolanartX(nftMintPubKey)

    const S = await getSolanartS()

    const C = await findRpk(nftMintPubKey)

    const A = await getSolanartA(new PublicKey(owner))

    // Get real price from blockchain
    const realPrice = await getPriceSA(x)
    if (!realPrice) {
      return
    }

    // Here we get the percentage change between the endpoint price and blockchain price,
    // since solanart and other exchanges have a certain time while updating their backend,
    // so you could get in a situation where the price got changed right before bot buying
    const priceChangePercent = percentageChange(price * Math.pow(10, 9), realPrice)
    if (priceChangePercent > 5) {
      return
    }

    const updateAuthority =
      process.env.BUY_TYPE === "NFT"
        ? "6SwTAKo4UXPCGEWC1DZa3uiSxAyNXJju1xip3rrHLnWe"
        : "F6kf6G18RQ4d5e4pmHF2YuEoY1procYD9qAVp4XFnCPi"

    const keys = [
      { pubkey: MY_KEY_PAIR.publicKey, isSigner: !0, isWritable: !1 },
      { pubkey: O, isSigner: !1, isWritable: !0 },
      { pubkey: new PublicKey(escrowAdd), isSigner: !1, isWritable: !0 },
      { pubkey: new PublicKey(owner), isSigner: !1, isWritable: !0 },
      { pubkey: x, isSigner: !1, isWritable: !0 },
      { pubkey: TOKEN_PROGRAM_PUBKEY, isSigner: !1, isWritable: !1 },
      {
        pubkey: new PublicKey("E6dkaYhqbZN3a1pDrdbajJ9D8xA66LBBcjWi6dDNAuJH"),
        isSigner: !1,
        isWritable: !0,
      },
      { pubkey: S, isSigner: !1, isWritable: !1 },
      { pubkey: C, isSigner: !1, isWritable: !0 },
      { pubkey: A, isSigner: !1, isWritable: !0 },
      { pubkey: SomeSolanArtPubKey, isSigner: !1, isWritable: !1 },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: !1, isWritable: !1 },
      {
        pubkey: new PublicKey(updateAuthority),
        isSigner: !1,
        isWritable: !0,
      },
    ]

    const assocTokenAccInstruction = createAssociatedTokenAccInstruction(
      new PublicKey(mint),
      O
    )

    const transInstruction = new TransactionInstruction({
      programId: AnotherSolanArtPubKey,
      keys: keys,
      data: Uint8Array.from([5].concat(new BN(realPrice).toArray("le", 8))) as Buffer,
    })

    return { transInstruction, assocTokenAccInstruction }
  } catch (err) {
    console.log(err)
  }
}
