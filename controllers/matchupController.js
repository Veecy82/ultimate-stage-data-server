const mongoTools = require('../database-scripts/utility/mongoTools')
const char = require('../database-scripts/utility/charIdTools')

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

  const data = await mongoTools.getMatchupDataOverall(char1Id, char2Id)

  res.render('matchup', {
    name1: char.toName[char1Id],
    name2: char.toName[char2Id],
    name1Wins: data.char1Wins,
    name2Wins: data.char2Wins,
  })
}
