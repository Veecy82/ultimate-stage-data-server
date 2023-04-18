const mongoTools = require('../database-scripts/utility/mongoTools')
const char = require('../database-scripts/utility/charIdTools')

exports.character = async (req, res, next) => {
  const charId = char.internalToId[req.params.internal.toLowerCase()]

  if (!charId) {
    const err = new Error(`Character '${req.params.internal}' not found`)
    err.status = 404
    return next(err)
  }

  const overallData = await mongoTools.getCharacterDataOverall(charId)

  const stageData = await mongoTools.getCharacterDataOnEachStage(charId)

  res.render('character', {
    name: char.toName[charId],
    wins: overallData.wins,
    losses: overallData.losses,
    stageData,
  })
}
