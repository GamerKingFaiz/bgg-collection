/* Going through the array and changing default values and converting string numbers to actual numbers so that the Table can sort them correctly */
const gameDataConversions = (array) => {
	array.forEach(game => {
		if (game.statistics[0].ratings[0].ranks[0].rank[0].$.value === 'Not Ranked')
			game.statistics[0].ratings[0].ranks[0].rank[0].$.value = 'N/A';
		else {
			game.statistics[0].ratings[0].ranks[0].rank[0].$.value = Number(game.statistics[0].ratings[0].ranks[0].rank[0].$.value);
		}

		game.minplayers[0].$.value = Number(game.minplayers[0].$.value);
		if (isNaN(game.minplayers[0].$.value))
			game.stats[0].$.minplayers = '--';

		game.maxplayers[0].$.value = Number(game.maxplayers[0].$.value);
		if (isNaN(game.maxplayers[0].$.value))
			game.maxplayers[0].$.value = '--';

		game.maxplaytime[0].$.value = Number(game.maxplaytime[0].$.value);
		if (isNaN(game.maxplaytime[0].$.value))
			game.maxplaytime[0].$.value = '--';

		if (game.yearpublished[0].$.value === undefined)
			game.yearpublished[0].$.value = ['--'];
	})
}

export default gameDataConversions;