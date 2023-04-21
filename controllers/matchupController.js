const mongoTools = require('../database-scripts/utility/mongoTools')
const char = require('../database-scripts/utility/charIdTools')

const util = require('../database-scripts/utility/util')

exports.matchup = async (req, res, next) => {
  const char1Id = char.internalToId[req.params.internal1.toLowerCase()]
  const char2Id = char.internalToId[req.params.internal2.toLowerCase()]

  if (!char1Id) {
    const err = new Error(`Character '${req.params.internal1}' not found`)
    err.status = 404
    return next(err)
  }

  if (!char2Id) {
    const err = new Error(`Character '${req.params.internal2}' not found`)
    err.status = 404
    return next(err)
  }

  if (char1Id === char2Id) {
    return res.redirect('/')
  }

  let overallData
  try {
    overallData = await mongoTools.getMatchupDataOverall(char1Id, char2Id)
  } catch (e) {
    return next(e)
  }
  const char1WinPct =
    Math.round(
      (10000 * overallData.char1Wins) /
        (overallData.char1Wins + overallData.char2Wins)
    ) / 100

  let stageData
  try {
    stageData = await mongoTools.getMatchupDataOnEachStage(char1Id, char2Id)
  } catch (e) {
    return next(e)
  }

  res.render('matchup', {
    route: 'matchup',
    name1: char.toName[char1Id],
    name2: char.toName[char2Id],
    internal1: char.toInternal[char1Id],
    internal2: char.toInternal[char2Id],
    char1Wins: overallData.char1Wins,
    char2Wins: overallData.char2Wins,
    char1WinPct,
    stageData,
    stageBgs: util.stages.images,
    sigPctThreshold: util.stages.matchupSigPctThreshold,
    sigQuantThreshold: util.stages.matchupSigQuantThreshold,
  })
}

exports.matchupForm = async (req, res, next) => {
  res.render('matchupForm', {
    route: 'matchup',
  })
}
