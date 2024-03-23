require('dotenv').config() // Load .env file
const axios = require('axios')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


function getPrices() {


	// API for price data.
	axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${process.env.PREFERRED_CURRENCY}&ids=${process.env.COIN_ID}`).then(res => {
		// If we got a valid response
		if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
			let currentPrice = res.data[0].current_price || 0 // Default to zero
			let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero
			let symbol = res.data[0].symbol || '?' 
			client.user.setActivity(`${priceChange.toFixed(2)}% | ${symbol.toUpperCase()}`, {type: "WATCHING"}) 

			client.guilds.cache.map(r => client.guilds.cache.find(guild => guild.id === r.id).me.setNickname(`BTC ${process.env.CURRENCY_SYMBOL}${(currentPrice).toLocaleString().replace(/,/g,process.env.THOUSAND_SEPARATOR)}`))

			console.log('Updated price to', currentPrice)
		}
		else
			console.log('Could not load player count data for', process.env.COIN_ID)

	}).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)
	console.log(client.guilds.cache.map(r => `${r.name} - ${r.id}`));
	getPrices() // Ping server once on startup
	setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
