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

  let options = null
  if (req.query.only) {
    if (req.query.only === 'online') {
      options = { isOnline: true }
    }
    if (req.query.only === 'offline') {
      options = { isOnline: false }
    }
  }

  console.log(options)

  let overallData
  try {
    overallData = await mongoTools.getCharacterDataOverall(charId, options)
  } catch (e) {
    return next(e)
  }
  const winPct =
    Math.round(
      (10000 * overallData.wins) / (overallData.wins + overallData.losses)
    ) / 100

  let stageData
  try {
    stageData = await mongoTools.getCharacterDataOnEachStage(charId, options)
  } catch (e) {
    return next(e)
  }

  let sigQuantThreshold = util.stages.characterSigQuantThreshold
  if (options && !options.isOnline) {
    sigQuantThreshold *= util.stages.offlineSigQuantMultiplier
  }

  res.render('character', {
    route: 'character',
    name: char.toName[charId],
    internal: char.toInternal[charId],
    wins: overallData.wins,
    losses: overallData.losses,
    winPct,
    stageData,
    stageBgs: util.stages.images,
    sigPctThreshold: util.stages.characterSigPctThreshold,
    sigQuantThreshold,
    options: {
      only: req.query.only ? req.query.only : 'BOTH',
    },
  })
}

exports.characterForm = async (req, res, next) => {
  res.render('characterForm', {
    title: 'Stage Data by Character',
    route: 'character',
  })
}
