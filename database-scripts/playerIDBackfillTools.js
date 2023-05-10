const Game = require('../models/game')
const apiTools = require('./utility/apiTools')

exports.cachedEntrants = new Map()

exports.getPlayerIdByEntrantId = async (entrantId) => {
  if (this.cachedEntrants.has(entrantId)) {
    return this.cachedEntrants.get(entrantId)
  }
  const obj = await this.getCurrentMiscDataFromServer()
  this.currMiscData = obj
  return obj
}

exports.updateCacheBySet = async (setId) => {
  const players = await apiTools.getPlayerInfoFromSetID(setId)
  for (const player of players) {
    this.cachedEntrants.set(player.entrantID, player.playerID)
  }
}

exports.countDocumentsWithPlayerIDs = async () => {
  return await Game.count({ winPlayerId: { $exists: true } })
}

exports.countDocumentsWithoutPlayerIDs = async () => {
  return await Game.count({ winPlayerId: { $exists: false } })
}

exports.findOneDocumentWithPlayerIDs = async () => {
  return await Game.findOne({ winPlayerId: { $exists: true } })
}

exports.findOneDocumentWithoutPlayerIDs = async () => {
  return await Game.findOne({ winPlayerId: { $exists: false } })
}

exports.updateExistingGamesWithPlayerIDs = async () => {
  let curr = await this.findOneDocumentWithoutPlayerIDs()

  while (curr) {
    if (
      !this.cachedEntrants.has(curr.winPlayer) ||
      !this.cachedEntrants.has(curr.losePlayer)
    ) {
      await this.updateCacheBySet(curr.setId)
    }

    const winPlayerId = await this.getPlayerIdByEntrantId(curr.winPlayer)
    const losePlayerId = await this.getPlayerIdByEntrantId(curr.losePlayer)

    await Game.findByIdAndUpdate(
      { _id: curr._id },
      { winPlayerId, losePlayerId }
    )

    curr = await this.findOneDocumentWithoutPlayerIDs()
  }
}
