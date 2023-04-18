const express = require('express')
const router = express.Router()

const characterController = require('../controllers/characterController.js')

router.get('/:internal', characterController.character)

module.exports = router
