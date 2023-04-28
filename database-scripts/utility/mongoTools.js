/* mongoTools.js
 *
 * A library of functions to query and save to USD's database
 *
 * Functions can make asynchronous requests to USD's database through Mongoose, return booleans or undefined, and do not interact with Start.gg's API
 */

const ProcessedTournament = require('../../models/processedTournament')
const Game = require('../../models/game')
const char = require('./charIdTools')

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

exports.getCharacterDataOverall = async (charId, options) => {
  const winCharFilter = { winChar: charId }
  const loseCharFilter = { loseChar: charId }
  if (options) {
    if (typeof options === 'object' && typeof options.isOnline === 'boolean') {
      winCharFilter.isOnline = options.isOnline
      loseCharFilter.isOnline = options.isOnline
    }
  }
  const [wins, losses] = await Promise.all([
    Game.countDocuments(winCharFilter),
    Game.countDocuments(loseCharFilter),
  ])
  return { wins, losses }
}

exports.getMatchupDataOverall = async (char1Id, char2Id, options) => {
  const char1Filter = { winChar: char1Id, loseChar: char2Id }
  const char2Filter = { winChar: char2Id, loseChar: char1Id }
  if (options) {
    if (typeof options === 'object' && typeof options.isOnline === 'boolean') {
      char1Filter.isOnline = options.isOnline
      char2Filter.isOnline = options.isOnline
    }
  }
  const [char1Wins, char2Wins] = await Promise.all([
    Game.countDocuments(char1Filter),
    Game.countDocuments(char2Filter),
  ])
  return { char1Wins, char2Wins }
}

// i believe these two functions are unused but im only commenting them in case something breaks
// and it ends up that they actually were being used

/* exports.getCharacterDataOnStage = async (charId, stage) => {
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
} */

exports.getCharacterDataOnEachStage = async (charId, options) => {
  // percentage of total games required to be deemed significant (between 0 and 1)
  const sigPctThreshold = util.stages.characterSigPctThreshold
  // number of total games required to be deemed significant (positive integer)
  let sigQuantThreshold = util.stages.characterSigQuantThreshold

  const winCharFilter = { winChar: charId }
  const loseCharFilter = { loseChar: charId }
  if (options) {
    if (typeof options === 'object' && typeof options.isOnline === 'boolean') {
      winCharFilter.isOnline = options.isOnline
      loseCharFilter.isOnline = options.isOnline
      if (!options.isOnline) {
        sigQuantThreshold *= util.stages.offlineSigQuantMultiplier
      }
    }
  }

  const [winData, lossData] = await Promise.all([
    Game.aggregate([
      { $match: winCharFilter },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
    Game.aggregate([
      { $match: loseCharFilter },
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
        obj.wins + obj.losses >= sigQuantThreshold ||
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

exports.getMatchupDataOnEachStage = async (char1Id, char2Id, options) => {
  // percentage of total games required to be deemed significant (between 0 and 1)
  const sigPctThreshold = util.stages.matchupSigPctThreshold
  // number of total games required to be deemed significant (positive integer)
  let sigQuantThreshold = util.stages.matchupSigQuantThreshold

  const char1Filter = { winChar: char1Id, loseChar: char2Id }
  const char2Filter = { winChar: char2Id, loseChar: char1Id }
  if (options) {
    if (typeof options === 'object' && typeof options.isOnline === 'boolean') {
      char1Filter.isOnline = options.isOnline
      char2Filter.isOnline = options.isOnline
      if (!options.isOnline) {
        sigQuantThreshold *= util.stages.offlineSigQuantMultiplier
      }
    }
  }

  const [char1Data, char2Data] = await Promise.all([
    Game.aggregate([
      { $match: char1Filter },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
    Game.aggregate([
      { $match: char2Filter },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]),
  ])

  let totalGames = 0
  for (const obj of char1Data) {
    totalGames += obj.count
  }
  for (const obj of char2Data) {
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
      let char1Wins = 0
      let char2Wins = 0
      for (const obj of char1Data) {
        if (obj._id === stage) {
          char1Wins = obj.count
          break
        }
      }
      for (const obj of char2Data) {
        if (obj._id === stage) {
          char2Wins = obj.count
          break
        }
      }
      const obj = {
        stage,
        char1Wins,
        char2Wins,
        char1WinPct:
          Math.round((10000 * char1Wins) / (char1Wins + char2Wins)) / 100 || 0,
        char2WinPct:
          Math.round((10000 * char2Wins) / (char1Wins + char2Wins)) / 100 || 0,
      }
      if (
        obj.char1Wins + obj.char2Wins >= sigQuantThreshold ||
        (obj.char1Wins + obj.char2Wins) / totalGames >= sigPctThreshold
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
    data[category].sort((a, b) => b.char1WinPct - a.char1WinPct)
  }
  return data
}

exports.countRecordedGamesAtEvent = async (slug) => {
  return await Game.countDocuments({ slug })
}

exports.countRecordedGamesAcrossAllTournaments = async (offlineOnly) => {
  const pipeline = []
  if (offlineOnly) {
    pipeline.push({ $match: { isOnline: false } })
  }
  pipeline.push({ $group: { _id: '$slug', count: { $sum: 1 } } })
  const result = await Game.aggregate(pipeline)

  const tournaments = {}
  for (const eventObj of result) {
    const spl = eventObj._id.split('/')
    const tournamentSlug = spl[0] + '/' + spl[1]
    if (!tournaments[tournamentSlug]) {
      tournaments[tournamentSlug] = eventObj.count
    } else {
      tournaments[tournamentSlug] += eventObj.count
    }
  }
  const unsortedTournaments = []
  for (const tournament in tournaments) {
    unsortedTournaments.push({
      slug: tournament,
      count: tournaments[tournament],
    })
  }
  const sortedTournaments = unsortedTournaments.sort(
    (a, b) => b.count - a.count
  )

  return unsortedTournaments
}

exports.removeGamesWithEventSlug = async (slug) => {
  try {
    console.log(`Trying to delete games from event ${slug}`)
    const response = await Game.deleteMany({ slug })
    if (response.deletedCount) {
      if (response.deletedCount > 0) {
        console.log(
          `Deleted ${response.deletedCount} games from blacklisted event`
        )
        return response.deletedCount
      }
    }
    return 0
  } catch (e) {
    console.log(`A problem occurred when trying to remove games from ${slug}`)
  }
}

exports.countUniqueEventSlugs = async () => {
  const res = await Game.aggregate([
    { $group: { _id: '$slug' } },
    { $group: { _id: 1, count: { $sum: 1 } } },
  ])
  return res[0].count
}

exports.getAllCharacterDataOverall = async () => {
  const ids = []
  const promises = []
  for (const id in char.toName) {
    ids.push(id)
    promises.push(this.getCharacterDataOverall(id))
  }
  const res = await Promise.all(promises)
  for (let i = 0; i < res.length; i++) {
    res[i].id = ids[i]
    res[i].name = char.toName[ids[i]]
  }
  return res
}

exports.getLastNProcessedEventsWithDataSlugs = async (n) => {
  const res = await Game.aggregate([
    {
      $group: {
        _id: '$slug',
        firstGame: { $first: '$_id' },
      },
    },
    {
      $sort: { firstGame: -1 },
    },
    {
      $limit: n,
    },
  ])

  const out = []
  for (const obj of res) {
    out.push(obj._id)
  }

  return out
}
