const aboutData = require('../views/aboutData.json')

exports.about = async (req, res, next) => {
  res.render('about', { route: 'about', information: aboutData.information })
}
