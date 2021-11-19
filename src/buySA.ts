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
  getSolanartA,
  getSolanartS,
  getSolanartX,
  tryBuyingToken,
} from "./utils"
import BN from "bn.js"

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
    const nftMintPubKey = new PublicKey(mint)

    const O = await findZ(nftMintPubKey)

    const x = await getSolanartX(nftMintPubKey)

    const S = await getSolanartS()

    const C = await findRpk(nftMintPubKey)

    const A = await getSolanartA(new PublicKey(owner))

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
        pubkey: new PublicKey("F6kf6G18RQ4d5e4pmHF2YuEoY1procYD9qAVp4XFnCPi"),
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
      data: Uint8Array.from(
        [5].concat(new BN(price * Math.pow(10, 9)).toArray("le", 8))
      ) as Buffer,
    })

    let trans = null
    while (!trans) {
      trans = await tryBuyingToken(assocTokenAccInstruction, transInstruction)
    }

    console.log(`[SolanArt] Successfully bought GT for ${price} SOL! TX: ${trans}`)
  } catch (err) {
    console.log(err)
  }
}
