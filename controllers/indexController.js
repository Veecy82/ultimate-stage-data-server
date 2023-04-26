const mongoTools = require('../database-scripts/utility/mongoTools')

exports.index = async (req, res, next) => {
  let data
  try {
    data = await Promise.all([mongoTools.getTotalGames()])
  } catch (e) {
    return next(e)
  }

  res.render('index', { numGames: data[0] })
}
