import axios from "axios"

const DE = axios.create({
  baseURL: "https://us-central1-digitaleyes-prod.cloudfunctions.net",
})

export const getCheapestOnDE = async () => {
  try {
    const { data } = await DE.get(
      `/offers-retriever?collection=${process.env.DE_COLLECTION_NAME!}&price=asc`
    )
    return data.offers[0]
  } catch (err) {
    console.log(err)
  }
}
