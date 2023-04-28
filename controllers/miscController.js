const miscDataTools = require('../database-scripts/miscDataTools')

exports.misc = async (req, res, next) => {
  let data
  try {
    data = await miscDataTools.createCurrentMiscDataObject()
  } catch (e) {
    return next(e)
  }

  res.render('misc', { title: 'Miscellaneous Statistics', ...data })
}
