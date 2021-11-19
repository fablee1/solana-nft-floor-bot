import {
  PublicKey,
  Connection,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js"
import {
  metaDataTokens,
  MyKeyPair,
  SecondTokenProgramPubKey,
  SomeDefault1ConstantPubKey,
  SysvarRentPubKey,
  TokenProgramPubKey,
} from "./constants"
const lo = require("buffer-layout")

export const conn = new Connection("https://digitaleyes.genesysgo.net/")

async function findAssociatedTokenAddress(
  data: Uint8Array[] | Buffer[],
  address: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress([...data], address))[0]
}

export const findZ = async (NftMintPubKey: PublicKey) => {
  const pk = await findAssociatedTokenAddress(
    [
      MyKeyPair.publicKey.toBuffer(),
      TokenProgramPubKey.toBuffer(),
      NftMintPubKey.toBuffer(),
    ],
    SecondTokenProgramPubKey
  )
  return pk
}

export const findXTokenTemp = async (pk: PublicKey) => {
  const data = await conn.getAccountInfo(pk, "singleGossip")
  if (data) {
    const blob = new lo.Blob(32, data.data)
    return new PublicKey(blob.decode(data.data, 65))
  }
}

export const findRpk = async (nftMintPubKey: PublicKey) => {
  const uintmetadata = Uint8Array.from(Array.from("metadata").map((s) => s.charCodeAt(0)))
  const pk = await findAssociatedTokenAddress(
    [uintmetadata, metaDataTokens.toBuffer(), nftMintPubKey.toBuffer()],
    metaDataTokens
  )
  return pk
}

export const createAssociatedTokenAcc = async (
  nftMintPubKey: PublicKey,
  zAdd: PublicKey
) => {
  const transInstruction = new TransactionInstruction({
    programId: SecondTokenProgramPubKey,
    keys: [
      {
        pubkey: MyKeyPair.publicKey,
        isSigner: !0,
        isWritable: !0,
      },
      {
        pubkey: zAdd,
        isSigner: !1,
        isWritable: !0,
      },
      {
        pubkey: MyKeyPair.publicKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: nftMintPubKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: SomeDefault1ConstantPubKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: TokenProgramPubKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: SysvarRentPubKey,
        isSigner: !1,
        isWritable: !1,
      },
    ],
    data: Buffer.alloc(0),
  })
  await sendAndConfirmTransaction(conn, new Transaction().add(transInstruction), [
    MyKeyPair,
  ])
}
