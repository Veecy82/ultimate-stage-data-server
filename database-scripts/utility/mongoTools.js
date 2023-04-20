/* mongoTools.js
 *
 * A library of functions to query and save to USD's database
 *
 * Functions can make asynchronous requests to USD's database through Mongoose, return booleans or undefined, and do not interact with Start.gg's API
 */

const ProcessedTournament = require('../../models/processedTournament')
const Game = require('../../models/game')

const util = require('./util')

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
  const [char1Wins, char2Wins] = await Promise.all([
    Game.countDocuments({ winChar: char1Id, loseChar: char2Id }),
    Game.countDocuments({ winChar: char2Id, loseChar: char1Id }),
  ])
  return { char1Wins, char2Wins }
}

exports.getCharacterDataOnStage = async (charId, stage) => {
  const [wins, losses] = await Promise.all([
    Game.countDocuments({ winChar: charId, stage }),
    Game.countDocuments({ loseChar: charId, stage }),
  ])
  return { wins, losses, stage }
}

exports.getMatchupDataOnStage = async (char1Id, char2Id, stage) => {
  const [char1Wins, char2Wins] = await Promise.all([
    Game.countDocuments({ winChar: char1Id, loseChar: char2Id, stage }),
    Game.countDocuments({ winChar: char2Id, loseChar: char1Id, stage }),
  ])
  return { char1Wins, char2Wins }
}

exports.getCharacterDataOnEachStage = async (charId) => {
  // percentage of total games required to be deemed significant (between 0 and 1)
  const sigPctThreshold = 0.03
  // number of total games required to be deemed significant (positive integer)
  const sigQuantThreshold = 200

  const [winData, lossData] = await Promise.all([
    Game.aggregate([
      { $match: { winChar: charId } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
    Game.aggregate([
      { $match: { loseChar: charId } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
  ])

  let totalGames = 0
  for (const obj of winData) {
    totalGames += obj.count
  }
  for (const obj of lossData) {
    totalGames += obj.count
  }

  const data = {
    starterStages: [],
    counterpickStages: [],
    retiredStages: [],
    lowDataStages: [],
  }

  for (const category of [
    'starterStages',
    'counterpickStages',
    'retiredStages',
  ]) {
    for (const stage of util.stages[category]) {
      let wins = 0
      let losses = 0
      for (const obj of winData) {
        if (obj._id === stage) {
          wins = obj.count
          break
        }
      }
      for (const obj of lossData) {
        if (obj._id === stage) {
          losses = obj.count
          break
        }
      }
      const obj = {
        stage,
        wins,
        losses,
        winPct: Math.round((10000 * wins) / (wins + losses)) / 100 || 0,
        losePct: Math.round((10000 * losses) / (wins + losses)) / 100 || 0,
      }
      if (
        obj.wins + obj.losses >= sigQuantThreshold &&
        (obj.wins + obj.losses) / totalGames >= sigPctThreshold
      ) {
        data[category].push(obj)
      } else {
        data.lowDataStages.push(obj)
      }
    }
  }

  for (const category of [
    'starterStages',
    'counterpickStages',
    'retiredStages',
    'lowDataStages',
  ]) {
    data[category].sort((a, b) => b.winPct - a.winPct)
  }
  return data
}
