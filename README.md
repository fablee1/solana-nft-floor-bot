# Solana NFT floor sweeper

Floor sweeper is a bot which finds the cheapest nft of your desired collection and buys it with the setted interval.

## Usage

Add your private key in base58 format to environmental variables like this `MY_PRIV_KEY=YOUR_PRIVATE_KEY`

In index.ts you will find a configuration section.

If you dont plan to use some of the exchanges you can leave the collection name from the url empty

```javascript
// Configurations, change as needed
const exchangesToUse = ["SA"] // DE for digital eyes, SA for solanart
const cronTime = "*/30 * * * *" // Set your preferred cron schedule
export const DE_COLLECTION_NAME = "Bothered%20Otters%20Golden%20Tickets" // Collection name in url (Digital Eyes)
export const SA_COLLECTION_NAME = "botheredotters" // Collection name in url (SolanArt)
```

Install all packages with `npm install` \
Build with `npm run build` \
Launch with `npm run start`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
