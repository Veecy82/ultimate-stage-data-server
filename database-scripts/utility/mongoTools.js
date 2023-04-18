/* mongoTools.js
 *
 * A library of functions to query and save to USD's database
 *
 * Functions can make asynchronous requests to USD's database through Mongoose, return booleans or undefined, and do not interact with Start.gg's API
 */

const ProcessedTournament = require('../../models/processedTournament')
const Game = require('../../models/game')

exports.haveProcessedTournamentAlready = async (slug) => {
  try {
    const pt = await ProcessedTournament.findOne({ slug })
    return !!pt
  } catch (err) {
    console.log(`Error checking for ProcessedTournament ${slug}`)
    throw err
  }
}

exports.saveProcessedTournamentToDatabase = async (slug) => {
  try {
    const pt = new ProcessedTournament({ slug })
    await pt.save()
  } catch (err) {
    console.log(`Error saving ProcessedTournament ${slug}`)
    throw err
  }
}

exports.haveProcessedGameAlready = async (gameId) => {
  try {
    const game = await Game.findOne({ gameId })
    return !!game
  } catch (err) {
    console.log(`Error checking for Game with gameId ${gameId}`)
    throw err
  }
}

exports.saveGameToDatabase = async (gameObject) => {
  try {
    const game = new Game(gameObject)
    await game.save()
  } catch (err) {
    console.log(`Error saving Game with gameId ${gameObject.gameId}`)
    throw err
  }
}

exports.checkAndSaveGameToDatabase = async (gameObject) => {
  if (await this.haveProcessedGameAlready(gameObject.gameId)) {
    return false
  }
  await this.saveGameToDatabase(gameObject)
  return true
}

/** Asynchronously count the total number of games in the database
 *
 * To specify online or offline, pass an object `options` with a boolean property `isOnline`
 */
exports.getTotalGames = async (options) => {
  const opts = {}
  if (options) {
    if (typeof options === 'object' && typeof options.isOnline === 'boolean') {
      opts.isOnline = options.isOnline
    }
  }
  return await Game.countDocuments(opts)
}

exports.getTotalTournaments = async () => {
  return await ProcessedTournament.countDocuments({})
}

exports.getCharacterDataOverall = async (charId) => {
  const [wins, losses] = await Promise.all([
    Game.countDocuments({ winChar: charId }),
    Game.countDocuments({ loseChar: charId }),
  ])
  return { wins, losses }
}

exports.getMatchupDataOverall = async (char1Id, char2Id) => {
  const data = await Promise.all([
    Game.countDocuments({ winChar: char1Id, loseChar: char2Id }),
    Game.countDocuments({ winChar: char2Id, loseChar: char1Id }),
  ])
  return { char1Wins: data[0], char2Wins: data[1] }
}

exports.getCharacterDataOnStage = async (charId, stage) => {
  const [wins, losses] = await Promise.all([
    Game.countDocuments({ winChar: charId, stage }),
    Game.countDocuments({ loseChar: charId, stage }),
  ])
  return { wins, losses, stage }
}

exports.getMatchupDataOnStage = async (char1Id, char2Id, stage) => {
  const data = await Promise.all([
    Game.countDocuments({ winChar: char1Id, loseChar: char2Id, stage }),
    Game.countDocuments({ winChar: char2Id, loseChar: char1Id, stage }),
  ])
  return { char1Wins: data[0], char2Wins: data[1], stage }
}
