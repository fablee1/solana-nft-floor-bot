import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import {
  AnotherConstantPubKey,
  EscrowProgramPubKey,
  EscrowTaxRecipient,
  MY_KEY_PAIR,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_PUBKEY,
} from "./constants"
import {
  createAssociatedTokenAccInstruction,
  findRpk,
  findXTokenTemp,
  findZ,
  tryBuyingToken,
} from "./utils"

export const buyDE = async ({
  pk,
  owner,
  mint,
  creator,
  price,
}: {
  pk: string
  owner: string
  mint: string
  creator: string
  price: number
}) => {
  try {
    const z = await findZ(new PublicKey(mint))

    const { xTokenTemp, realPrice } = await findXTokenTemp(new PublicKey(pk))

    if (realPrice !== price) {
      return null
    }

    if (xTokenTemp) {
      const r = await findRpk(new PublicKey(mint))

      const keys = [
        { pubkey: MY_KEY_PAIR.publicKey, isSigner: !0, isWritable: !1 },
        { pubkey: z, isSigner: !1, isWritable: !0 },
        { pubkey: xTokenTemp, isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(owner), isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(pk), isSigner: !1, isWritable: !0 },
        { pubkey: EscrowTaxRecipient, isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(mint), isSigner: !1, isWritable: !0 },
        { pubkey: r, isSigner: !1, isWritable: !0 },
        { pubkey: TOKEN_PROGRAM_PUBKEY, isSigner: !1, isWritable: !1 },
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: !1, isWritable: !1 },
        { pubkey: AnotherConstantPubKey, isSigner: !1, isWritable: !1 },
        { pubkey: new PublicKey(creator), isSigner: !1, isWritable: !0 },
      ]

      const transInstruction = new TransactionInstruction({
        programId: EscrowProgramPubKey,
        keys: keys,
        data: Uint8Array.from([1, 1, 0, 0, 0, 0, 0, 0, 0]) as Buffer,
      })

      const assocTokenAccInstruction = createAssociatedTokenAccInstruction(
        new PublicKey(mint),
        z
      )

      return { transInstruction, assocTokenAccInstruction }

      // let trans = null
      // while (!trans) {
      //   trans = await tryBuyingToken(assocTokenAccInstruction, transInstruction)
      // }

      // console.log(
      //   `[Digital Eyes] Successfully bought GT for ${
      //     price / Math.pow(10, 9)
      //   } SOL! TX: ${trans}`
      // )
    }
  } catch (err) {
    console.log(err)
  }
}
