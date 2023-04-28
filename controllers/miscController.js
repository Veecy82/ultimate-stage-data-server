const miscDataTools = require('../database-scripts/miscDataTools')

exports.misc = async (req, res, next) => {
  let data
  try {
    data = await miscDataTools.getCurrentMiscData()

    const slugsOnly = data.lastTenProcessedSlugs
    const richSlugs = []
    for (const slug of slugsOnly) {
      const obj = {}
      obj.url = 'https://start.gg/' + slug
      const pieces = slug.split('/')
      obj.shortenedSlug = pieces[1] + '/' + pieces[3]
      richSlugs.push(obj)
    }

    data.richSlugs = richSlugs
  } catch (e) {
    return next(e)
  }

  res.render('misc', { title: 'Miscellaneous Statistics', ...data })
}
