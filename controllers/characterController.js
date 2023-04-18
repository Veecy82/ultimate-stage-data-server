const mongoTools = require('../database-scripts/utility/mongoTools')
const char = require('../database-scripts/utility/charIdTools')

// const Game = require('../models/game')

const util = require('../database-scripts/utility/util')

exports.character = async (req, res, next) => {
  const charId = char.internalToId[req.params.internal.toLowerCase()]

  if (!charId) {
    const err = new Error(`Character '${req.params.internal}' not found`)
    err.status = 404
    return next(err)
  }

  console.log('stage list:')
  console.log(util.stages)

  const stagePromises = []
  for (const stage of util.stages) {
    stagePromises.push(mongoTools.getCharacterDataOnStage(charId, stage))
  }
  const stageData = await Promise.all(stagePromises)

  const overallData = await mongoTools.getCharacterDataOverall(charId)

  res.render('character', {
    name: char.toName[charId],
    wins: overallData.wins,
    losses: overallData.losses,
    stageData,
  })
}
