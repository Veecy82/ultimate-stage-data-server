require('dotenv').config()

const apiTools = require('./database-scripts/utility/apiTools')
const util = require('./database-scripts/utility/util')

const char = require('./database-scripts/utility/charIdTools')

async function main() {
  const filePaths = []
  for (let i = 2018; i <= 2018; i++) {
    // filePaths.push(`./misc-data/event-entrant-pairs/${i}.json`)
    filePaths.push(`./misc-data/event-entrant-pairs/eventSlugsSmall.json`)
  }
  const allTourneys = await util.getMapFromFiles(filePaths)
  const filteredTourneys = util.filterMapByValue(
    allTourneys,
    (val) => val >= 20
  )

  const games = []

  console.log(`We're going to query ${filteredTourneys.size} events`)

  for (const slug of filteredTourneys.keys()) {
    if (await apiTools.eventSlugRepresentativeHasStageData(slug)) {
      const newGames = await apiTools.getGamesFromVettedEvent(slug)
      for (const game of newGames) {
        games.push(game)
      }
    }
  }

  console.log(games)
  console.log(`${games.length} games with data found`)
}

main()
