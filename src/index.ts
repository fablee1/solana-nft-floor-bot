import schedule from "node-schedule"
import { buyDE } from "./buyDE"
import { getCheapestOnDE } from "./fetcher"

const job = schedule.scheduleJob("0 */2 * * *", async () => {
  const cheapestOffer = await getCheapestOnDE()

  console.log(`Buying Ticket for ${cheapestOffer.price / Math.pow(10, 9)} SOL`)

  const neededOptions = {
    pk: cheapestOffer.pk,
    owner: cheapestOffer.owner,
    mint: cheapestOffer.mint,
    creator: cheapestOffer.creators[0].Address,
  }

  await buyDE(neededOptions)
})
