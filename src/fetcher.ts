import axios from "axios"
import { DE_COLLECTION_NAME, SA_COLLECTION_NAME } from "./config"

const DE = axios.create({
  baseURL: "https://us-central1-digitaleyes-prod.cloudfunctions.net",
})

const SA = axios.create({
  baseURL: "https://qzlsklfacc.medianetwork.cloud",
})

export const getCheapestOnDE = async () => {
  try {
    const { data } = await DE.get(
      `/offers-retriever?collection=${DE_COLLECTION_NAME}&price=asc`
    )
    return data.offers[0]
  } catch (err) {
    console.log(err)
  }
}

export const getCheapestOnSA = async () => {
  try {
    const { data } = await SA.get(`/nft_for_sale?collection=${SA_COLLECTION_NAME}`)
    const typeOfBuy = process.env.BUY_TYPE
    if (typeOfBuy) {
      if (typeOfBuy === "TICKET") {
        return data.find((listing: any) => listing.name.toLowerCase().includes("ticket"))
      } else if (typeOfBuy === "NFT") {
        return data.find((listing: any) => !listing.name.toLowerCase().includes("ticket"))
      }
    }
    return data[0]
  } catch (err) {
    console.log(err)
  }
}
