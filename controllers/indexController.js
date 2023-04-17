const mongoTools = require('../database-scripts/utility/mongoTools')

exports.index = async (req, res) => {
  const data = await Promise.all([
    mongoTools.getTotalGames(),
    mongoTools.getTotalTournaments(),
  ])

  res.render('index', { numGames: data[0], numTournaments: data[1] })
}
