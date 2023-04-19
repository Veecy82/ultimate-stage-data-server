const mongoTools = require('../database-scripts/utility/mongoTools')
const char = require('../database-scripts/utility/charIdTools')

const util = require('../database-scripts/utility/util')

exports.character = async (req, res, next) => {
  const charId = char.internalToId[req.params.internal.toLowerCase()]

  if (!charId) {
    const err = new Error(`Character '${req.params.internal}' not found`)
    err.status = 404
    return next(err)
  }

  const overallData = await mongoTools.getCharacterDataOverall(charId)
  const winPct =
    Math.round(
      (10000 * overallData.wins) / (overallData.wins + overallData.losses)
    ) / 100

  const stageData = await mongoTools.getCharacterDataOnEachStage(charId)

  res.render('character', {
    name: char.toName[charId],
    internal: char.toInternal[charId],
    wins: overallData.wins,
    losses: overallData.losses,
    winPct,
    stageData,
    stageBgs: util.stages.images,
  })
}
