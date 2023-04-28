const miscDataTools = require('../database-scripts/miscDataTools')

exports.index = async (req, res, next) => {
  let miscData
  try {
    miscData = await miscDataTools.getCurrentMiscData()
  } catch (e) {
    return next(e)
  }

  res.render('index', {
    title: 'Ultimate Stage Data',
    numGames: miscData.totalGameCount,
  })
}
