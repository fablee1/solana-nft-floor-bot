import schedule from "node-schedule"
import { buyDE } from "./buyDE"
import { buySA } from "./buySA"
import { cronTime, exchangesToUse } from "./config"
import { getCheapestOnDE, getCheapestOnSA } from "./fetcher"
import { tryBuyingToken } from "./utils"

const main = async () => {
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

  let instructions = null
  switch (cheapestOffer[0]) {
    case "DE":
      const neededOptions = {
        pk: cheapestOfferData.pk,
        owner: cheapestOfferData.owner,
        mint: cheapestOfferData.mint,
        creator: cheapestOfferData.creators[0].Address,
        price: cheapestOfferData.price,
      }
      instructions = await buyDE(neededOptions)
      break
    case "SA":
      instructions = await buySA({
        escrowAdd: cheapestOfferData.escrowAdd,
        owner: cheapestOfferData.seller_address,
        mint: cheapestOfferData.token_add,
        price: cheapestOfferData.price,
      })
      break
    default:
      console.log("No exchange matched for cheapest offer!")
  }

  if (instructions) {
    let timesToTry = 3
    let trans = null
    while (timesToTry > 0) {
      timesToTry--
      trans = await tryBuyingToken(
        instructions.assocTokenAccInstruction,
        instructions.transInstruction
      )
    }
    if (trans) {
      console.log(
        `[${
          cheapestOffer[0] === "DE"
            ? "Digital Eyes"
            : cheapestOffer[0] === "SA"
            ? "SolanArt"
            : "Uknown"
        }] Successfully bought GT for ${
          cheapestOffer[0] === "SA"
            ? cheapestOfferData[1].price * Math.pow(10, 9)
            : cheapestOfferData[1].price
        } SOL! TX: ${trans}`
      )
      return true
    } else {
      console.log("Couldnt buy cheapest one, retrying...")
      return false
    }
  } else {
    console.log("Problem creating instructions.")
    return false
  }
}

// Main job starts here
schedule.scheduleJob(cronTime, async () => {
  let bought = false
  while (!bought) {
    bought = await main()
  }
})
