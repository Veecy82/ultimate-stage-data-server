const express = require('express')
const router = express.Router()

const matchupController = require('../controllers/matchupController.js')

router.get('/:internal1/:internal2', matchupController.matchup)

module.exports = router
