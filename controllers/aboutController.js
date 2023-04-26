const aboutData = require('../views/aboutData.json')

exports.about = async (req, res, next) => {
  res.render('about', {
    title: 'About Ultimate Stage Data',
    route: 'about',
    information: aboutData.information,
    technicalInformation: aboutData.technical,
  })
}
