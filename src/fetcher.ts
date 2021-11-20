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
    return data[0]
  } catch (err) {
    console.log(err)
  }
}
