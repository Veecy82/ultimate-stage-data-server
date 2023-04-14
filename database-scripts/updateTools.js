/* updateTools.js
 *
 * A library of functions fo fetch new data from Start.gg and populate USD's database
 *
 * Functions may both query Start.gg's API and USD's database through Mongoose
 */
const mongoTools = require('./utility/mongoTools')
const apiTools = require('./utility/apiTools')

exports.processTournamentSlug = async (slug) => {
  if (await mongoTools.haveProcessedTournamentAlready(slug)) {
    console.log(`Tournament [${slug}] already processed`)
    return
  }
  if (!(await apiTools.eventSlugRepresentativeHasStageData(slug))) {
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
