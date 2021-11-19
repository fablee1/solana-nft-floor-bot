import {
  PublicKey,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js"
import {
  AnotherConstantPubKey,
  EscrowProgramPubKey,
  EscrowTaxRecipient,
  MyKeyPair,
  SomeDefault1ConstantPubKey,
  TokenProgramPubKey,
} from "./constants"
import { conn, createAssociatedTokenAcc, findRpk, findXTokenTemp, findZ } from "./utils"

export const buyDE = async ({
  pk,
  owner,
  mint,
  creator,
}: {
  pk: string
  owner: string
  mint: string
  creator: string
}) => {
  try {
    const z = await findZ(new PublicKey(mint))

    const xTokenTemp = await findXTokenTemp(new PublicKey(pk))

    if (xTokenTemp) {
      const r = await findRpk(new PublicKey(mint))

      await createAssociatedTokenAcc(new PublicKey(mint), z)

      const keys = [
        { pubkey: MyKeyPair.publicKey, isSigner: !0, isWritable: !1 },
        { pubkey: z, isSigner: !1, isWritable: !0 },
        { pubkey: xTokenTemp, isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(owner), isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(pk), isSigner: !1, isWritable: !0 },
        { pubkey: EscrowTaxRecipient, isSigner: !1, isWritable: !0 },
        { pubkey: new PublicKey(mint), isSigner: !1, isWritable: !0 },
        { pubkey: r, isSigner: !1, isWritable: !0 },
        { pubkey: TokenProgramPubKey, isSigner: !1, isWritable: !1 },
        { pubkey: SomeDefault1ConstantPubKey, isSigner: !1, isWritable: !1 },
        { pubkey: AnotherConstantPubKey, isSigner: !1, isWritable: !1 },
        { pubkey: new PublicKey(creator), isSigner: !1, isWritable: !0 },
      ]

      const transInstruction = new TransactionInstruction({
        programId: EscrowProgramPubKey,
        keys: keys,
        data: Uint8Array.from([1, 1, 0, 0, 0, 0, 0, 0, 0]) as any,
      })

      await sendAndConfirmTransaction(conn, new Transaction().add(transInstruction), [
        MyKeyPair,
      ])

      console.log("Successfully bought GT!")
    }
  } catch (err) {
    console.log(err)
  }
}
