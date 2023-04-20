exports.about = async (req, res, next) => {
  res.render('about', { route: 'about' })
}
