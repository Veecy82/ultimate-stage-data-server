/* updateTools.js
 *
 * A library of functions fo fetch new data from Start.gg and populate USD's database
 *
 * Functions may both query Start.gg's API and USD's database through Mongoose
 */
const mongoTools = require('./utility/mongoTools')
const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

exports.processTournamentSlug = async (slug) => {
  if (await mongoTools.haveProcessedTournamentAlready(slug)) {
    console.log(`Tournament [${slug}] already processed`)
    return
  }
  if (!(await apiTools.eventSlugRepresentativeHasStageData(slug))) {
    await mongoTools.saveProcessedTournamentToDatabase(slug)
    return
  }
  const games = await apiTools.getGamesFromVettedEvent(slug)

  console.log(`Saving games from [${slug}] to database...`)
  for (const game of games) {
    const saved = await mongoTools.checkAndSaveGameToDatabase(game)
    if (!saved) {
      console.log(
        `Warning: Game with gameId ${game.gameId} already in database (did not overwrite)`
      )
    }
  }
  await mongoTools.saveProcessedTournamentToDatabase(slug)
  console.log(`Tournament [${slug}] recorded in database as processed`)
}

exports.processTournamentsInLongPeriod = async (unixStart, unixEnd) => {}

exports.processTournamentsFromFileOfEventSize = async (
  pathToFile,
  minEntrants
) => {
  const tournaments = await util.getMapFromFiles([pathToFile])
  const filteredTournaments = util.filterMapByValue(
    tournaments,
    (v) => v >= minEntrants
  )
  let i = 1
  for (const [key, value] of filteredTournaments) {
    console.log(
      `Checking tournament... (${i++} of ${filteredTournaments.size})`
    )
    if (value >= minEntrants) {
      await this.processTournamentSlug(key)
    }
  }
}

exports.processTournamentsFromFile = async (pathToFile) => {
  await this.processTournamentsFromFileOfEventSize(pathToFile, 0)
}

exports.removeGamesFromBlacklistedTournaments = async () => {
  const blacklistedEvents = await apiTools.getAllBlacklistedEvents()

  let deletedCount = 0
  for (const event of blacklistedEvents) {
    deletedCount += await mongoTools.removeGamesWithEventSlug(event)
  }
  console.log(`Deleted ${deletedCount} total games`)
}
