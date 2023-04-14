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
