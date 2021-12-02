import {
  PublicKey,
  Connection,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js"
import {
  AnotherSolanArtPubKey,
  METADATA_PROGRAM_ID,
  MY_KEY_PAIR,
  SomeSolanArtPubKey,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  SYSVAR_RENT_PUBKEY,
  TOKEN_PROGRAM_PUBKEY,
} from "./constants"
import { Blob, struct, u8 } from "@solana/buffer-layout"
const lo = require("buffer-layout")
import BN from "bn.js"

export const conn = new Connection("https://digitaleyes.genesysgo.net/")

// Utils for decoding
const blob = (size: number, data: string) => new Blob(size, data)

const structSA = struct([
  u8("isInitialized"),
  blob(32, "initializerPubkey"),
  blob(32, "initializerTempTokenAccountPubkey"),
  blob(8, "expectedAmount"),
])

const structDE = struct([
  u8("isInitialized"),
  blob(32, "initializerPubkey"),
  blob(32, "mintPubkey"),
  blob(32, "initializerTempTokenAccountPubkey"),
  blob(8, "expectedAmount"),
])
// utils for decoding

async function findAssociatedTokenAddress(
  data: Uint8Array[] | Buffer[],
  address: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress([...data], address))[0]
}

export const findZ = async (NftMintPubKey: PublicKey) => {
  const pk = await findAssociatedTokenAddress(
    [
      MY_KEY_PAIR.publicKey.toBuffer(),
      TOKEN_PROGRAM_PUBKEY.toBuffer(),
      NftMintPubKey.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  )
  return pk
}

export const getPriceSA = async (pk: PublicKey) => {
  const data = await conn.getAccountInfo(pk, "singleGossip")
  if (data) {
    const decoded = structSA.decode(data.data)
    return new BN(decoded.expectedAmount, 10, "le").toNumber()
  }
}

export const findXTokenTemp = async (pk: PublicKey) => {
  const data = await conn.getAccountInfo(pk, "singleGossip")
  if (data) {
    const testBlob = new lo.Blob(8, data.data)
    const realPrice = new BN(
      Array.from(testBlob.decode(data.data, 97))
        .reverse()
        .map(function (e: any) {
          return "00".concat(e.toString(16)).slice(-2)
        })
        .join(""),
      16
    ).toNumber()

    const blob = new lo.Blob(32, data.data)
    return { xTokenTemp: new PublicKey(blob.decode(data.data, 65)), realPrice }
  } else {
    return { xTokenTemp: null, realPrice: null }
  }
}

export const findRpk = async (nftMintPubKey: PublicKey) => {
  const uintmetadata = Uint8Array.from(Array.from("metadata").map((s) => s.charCodeAt(0)))
  const pk = await findAssociatedTokenAddress(
    [uintmetadata, METADATA_PROGRAM_ID.toBuffer(), nftMintPubKey.toBuffer()],
    METADATA_PROGRAM_ID
  )
  return pk
}

export const getSolanartX = async (nftMintPubKey: PublicKey) => {
  const saleToUint8 = Uint8Array.from(Array.from("sale").map((s) => s.charCodeAt(0)))
  const x = await findAssociatedTokenAddress(
    [saleToUint8, nftMintPubKey.toBuffer()],
    AnotherSolanArtPubKey
  )
  return x
}

export const getSolanartS = async () => {
  const escrowToUint8 = Uint8Array.from(Array.from("escrow").map((s) => s.charCodeAt(0)))
  const S = await findAssociatedTokenAddress([escrowToUint8], AnotherSolanArtPubKey)
  return S
}

export const getSolanartA = async (sellerAddress: PublicKey) => {
  const nftToUint8 = Uint8Array.from(Array.from("nft").map((s) => s.charCodeAt(0)))
  const A = await findAssociatedTokenAddress(
    [nftToUint8, sellerAddress.toBuffer()],
    SomeSolanArtPubKey
  )
  return A
}

export const createAssociatedTokenAccInstruction = (
  nftMintPubKey: PublicKey,
  zAdd: PublicKey
) => {
  const transInstruction = new TransactionInstruction({
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    keys: [
      {
        pubkey: MY_KEY_PAIR.publicKey,
        isSigner: !0,
        isWritable: !0,
      },
      {
        pubkey: zAdd,
        isSigner: !1,
        isWritable: !0,
      },
      {
        pubkey: MY_KEY_PAIR.publicKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: nftMintPubKey,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: SYSTEM_PROGRAM_ID,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: TOKEN_PROGRAM_PUBKEY,
        isSigner: !1,
        isWritable: !1,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: !1,
        isWritable: !1,
      },
    ],
    data: Buffer.alloc(0),
  })
  return transInstruction
}

export const tryBuyingToken = async (
  assocTokenInstruction: TransactionInstruction,
  buyTransInstruction: TransactionInstruction
) => {
  try {
    const trans = await sendAndConfirmTransaction(
      conn,
      new Transaction().add(assocTokenInstruction).add(buyTransInstruction),
      [MY_KEY_PAIR]
    )
    return trans
  } catch {
    try {
      const trans = await sendAndConfirmTransaction(
        conn,
        new Transaction().add(buyTransInstruction),
        [MY_KEY_PAIR]
      )
      return trans
    } catch {
      console.log("Error sending transaction due to Solana Errors. Retrying...")
      return null
    }
  }
}
