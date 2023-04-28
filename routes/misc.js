const express = require('express')
const router = express.Router()

const miscController = require('../controllers/miscController')

router.get('/', miscController.misc)

module.exports = router
