require('dotenv').config() // Load .env file
const axios = require('axios')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const carson = {
    "id": "aFl1lSP3pRBFPGm_wFBdbepTpmfSX5wvwc6Sk_yCai9bBZY",
    "accountId": "wYlNCh1RG_M7OOUrdVSsMhwV_3qyTWNtQKAt3I5V3e6o7tg",
    "puuid": "uGFWgchJozmNrv3QUvAJq644jebM0QJsvIxcwOJhvJIPiCrNcxFvJIkDFeBPFAJOScAhlKwwACu8xA",
    "name": "Young Kuan Don",
    "profileIconId": 3222,
}

let token = 'RGAPI-c2c17294-b172-475e-b542-94361661cc21'
let matchesURL = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/uGFWgchJozmNrv3QUvAJq644jebM0QJsvIxcwOJhvJIPiCrNcxFvJIkDFeBPFAJOScAhlKwwACu8xA/ids?start=0&count=2'

async function getMatches() {
	let getMatches = await axios.get(matchesURL, {
		headers: {
			'X-Riot-Token': token
		}})
	return getMatches.data
}

async function getMatch1(match) {
	match = await match
	let getMatch1 = await axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/' + match, {
		headers: {
			'X-Riot-Token': token
		}})

	let participants = getMatch1.data.info.participants
	const found = participants.find(({ puuid }) => puuid === "uGFWgchJozmNrv3QUvAJq644jebM0QJsvIxcwOJhvJIPiCrNcxFvJIkDFeBPFAJOScAhlKwwACu8xA");
	return found.win 
}

async function getMatch1Date(match) {
	let getMatch1Date = await axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/' + match, {
		headers: {
			'X-Riot-Token': token
		}})
	let info = getMatch1Date.data.info.gameEndTimestamp
	return info.toString()
}

async function getMatch2Date(match) {
	let getMatch2Date = await axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/' + match, {
		headers: {
			'X-Riot-Token': token
		}})
	let info = getMatch2Date.data.info.gameEndTimestamp
	return info.toString()
}

fourHours = 4 * 60 * 60 * 1000

function main() {
	getMatches().then(function(result) {
		games = result
		getMatch1(games[0]).then(function(result) {
			winLoss = result
			getMatch1Date(games[0]).then(function(result) {
				date1 = result
				getMatch2Date(games[1]).then(function(result) {
					date2 = result
					let currentTime = new Date().getTime()
					let difference = currentTime - date1
					if (fourHours < difference) {
						if (winLoss) {
							winLoss = 'the Fat Dub'
							client.user.setActivity(`${winLoss}`, {type: "WATCHING"}) 
							client.guilds.cache.map(r => client.guilds.cache.find(guild => guild.id === r.id).me.setNickname(`CARSON DUBS ONLY`))
							console.log('hi')
						} else {
							winLoss = 'you suck. ended on an L dip'
							client.user.setActivity(`${winLoss}`, {type: "WATCHING"}) 
							client.guilds.cache.map(r => client.guilds.cache.find(guild => guild.id === r.id).me.setNickname(`CARSON ENDED ON AN L`))
							console.log('hi')
						}
					} else {
						client.user.setActivity(`for the dub`, {type: "WATCHING"}) 
						client.guilds.cache.map(r => client.guilds.cache.find(guild => guild.id === r.id).me.setNickname(`Fighting for the Dub`))
						console.log('hi')
					}
				});
			});
		});
	});
};

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)
	console.log(client.guilds.cache.map(r => `${r.name} - ${r.id}`));
	main() // Ping server once on startup
	setInterval( main, 10000 );
})


// Login to Discord
client.login(process.env.DISCORD_TOKEN)
