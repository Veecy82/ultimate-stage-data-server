// The only reason I'm exporting these examples is so that my linter stops complaining to me
//
// These snippets are not meant to be run, and probably would fail to run due to the relative file paths
//
// They were initially run from `index.js`, so if you really want to run them you should paste them into there

const apiTools = require('../utility/apiTools')
const util = require('../utility/util')
const char = require('../utility/charIdTools')

// Write `slug, numEntrants` pairs of all completed events in 2019 to file
exports.example1 = async () => {
  const slugs = await apiTools.getCompletedEventSlugsWithEntrantsInLongPeriod(
    2019,
    1,
    1,
    2020,
    1,
    1
  )

  await util.writeMapToJSON('./misc-data/event-entrant-pairs/2019.json', slugs)
}

// Print out sets and games with character & stage win/loss from a particular event slug
exports.example2 = async () => {
  let lastSet = -1
  let setCount = 1
  let gameNumber = 1
  const games = await apiTools.getGamesFromVettedEvent(
    'tournament/ib-server-weekly-46-eu-only/event/singles'
  )

  for (const game of games) {
    if (game.setId !== lastSet) {
      console.log(`DATA FOR SET ${setCount}:`)
      lastSet = game.setId
      setCount += 1
      gameNumber = 1
    }
    console.log(
      `GAME ${gameNumber++}: ${char.toName[game.winChar]} beats ${
        char.toName[game.loseChar]
      } on ${game.stage}`
    )
  }
}

// (Doesn't call Start.gg's API)
// Determine slugs of all events from 2018 through 2023, inclusive, with more than 1000 entrants
exports.example3 = async () => {
  const filePaths = []
  for (let i = 2018; i <= 2023; i++) {
    filePaths.push(`./misc-data/event-entrant-pairs/${i}.json`)
  }
  const allTourneys = await util.getMapFromFiles(filePaths)
  const filteredTourneys = util.filterMapByValue(
    allTourneys,
    (val) => val > 1000
  )

  console.log(filteredTourneys)
}
