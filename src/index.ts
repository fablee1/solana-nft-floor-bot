import schedule from "node-schedule"
import { buyDE } from "./buyDE"
import { buySA } from "./buySA"
import { getCheapestOnDE, getCheapestOnSA } from "./fetcher"

// Configurations, change as needed
const exchangesToUse = ["SA"] // DE for digital eyes, SA for solanart
const cronTime = "*/30 * * * *" // Set your preferred cron schedule
export const DE_COLLECTION_NAME = "Bothered%20Otters%20Golden%20Tickets" // Collection name in url (Digital Eyes)
export const SA_COLLECTION_NAME = "botheredotters" // Collection name in url (SolanArt)

// Main job starts here
schedule.scheduleJob(cronTime, async () => {
  const offers: { [key: string]: any } = {}

  await Promise.all(
    exchangesToUse.map(async (ex) => {
      try {
        if (ex === "SA") {
          offers[ex] = await getCheapestOnSA()
        } else if (ex === "DE") {
          offers[ex] = await getCheapestOnDE()
        }
      } catch (err) {
        console.log(err)
      }
    })
  )

  const cheapestOffer = Object.entries(offers).sort(
    (a, b) =>
      (a[0] === "SA" ? a[1].price * Math.pow(10, 9) : a[1].price) -
      (b[0] === "SA" ? b[1].price * Math.pow(10, 9) : b[1].price)
  )[0]

  const cheapestOfferData = cheapestOffer[1]

  switch (cheapestOffer[0]) {
    case "DE":
      const neededOptions = {
        pk: cheapestOfferData.pk,
        owner: cheapestOfferData.owner,
        mint: cheapestOfferData.mint,
        creator: cheapestOfferData.creators[0].Address,
        price: cheapestOfferData.price,
      }
      await buyDE(neededOptions)
      break
    case "SA":
      await buySA({
        escrowAdd: cheapestOfferData.escrowAdd,
        owner: cheapestOfferData.seller_address,
        mint: cheapestOfferData.token_add,
        price: cheapestOfferData.price,
      })
      break
    default:
      console.log("No exchange matched for cheapest offer!")
  }
})
