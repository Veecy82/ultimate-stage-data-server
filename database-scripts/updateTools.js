/* updateTools.js
 *
 * A library of functions for fetching new data from Start.gg and populating USD's database
 *
 * Functions may query both Start.gg's API and USD's database through Mongoose
 */
const mongoTools = require('./utility/mongoTools')
const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

exports.getBlackListedEventsWithCache = async () => {
  if (this.blacklistedEvents) {
    return this.blacklistedEvents
  }
  exports.blacklistedEvents = await apiTools.getAllBlacklistedEvents()
  return exports.blacklistedEvents
}

exports.processTournamentSlug = async (slug, onlyProcessIfOffline) => {
  const blacklist = await this.getBlackListedEventsWithCache()
  if (blacklist.includes(slug)) {
    console.log(`Not processing blacklisted slug ${slug}`)
    return
  }
  if (await mongoTools.haveProcessedTournamentAlready(slug)) {
    console.log(`Tournament [${slug}] already processed`)
    return
  }
  if (onlyProcessIfOffline) {
    if (await apiTools.getOnlineStatusOfEventSlug(slug)) {
      console.log('Stopping processing, only checking offline tournaments')
      return
    }
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

exports.processAllTournamentsInPastNDays = async (n) => {
  const tournaments =
    await apiTools.getCompletedEventSlugsWithEntrantsInPastNDays(n)
  for (const [key, value] of tournaments) {
    await this.processTournamentSlug(key)
  }
}

exports.processTournamentsFromFileOfEventSize = async (
  pathToFile,
  minEntrants,
  onlyProcessIfOffline
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
      await this.processTournamentSlug(key, onlyProcessIfOffline)
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

exports.loadSampleDataset = async () => {
  await this.processTournamentsFromFile(
    './misc-data/event-entrant-pairs/eventSlugsSmall.json'
  )
}
