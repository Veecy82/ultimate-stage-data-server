const miscDataTools = require('../database-scripts/miscDataTools')
const char = require('../database-scripts/utility/charIdTools')

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

  res.render('misc', {
    title: 'Miscellaneous Statistics',
    ...data,
    bestWinCharInternal: char.toInternal[char.nameToId[data.bestWinCharName]],
    worstWinCharInternal: char.toInternal[char.nameToId[data.worstWinCharName]],
    mostGamesCharInternal:
      char.toInternal[char.nameToId[data.mostGamesCharName]],
    leastGamesCharInternal:
      char.toInternal[char.nameToId[data.leastGamesCharName]],
  })
}
