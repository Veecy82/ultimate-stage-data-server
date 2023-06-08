// sandboxdev.js
// The purpose of this file is to manually test or run functions like those in apiTools, updateTools, or mongoTools on the alternate production database

require('dotenv').config()

const apiTools = require('./database-scripts/utility/apiTools')
const updateTools = require('./database-scripts/updateTools')
const mongoTools = require('./database-scripts/utility/mongoTools')
const util = require('./database-scripts/utility/util')
const misc = require('./database-scripts/miscDataTools')
const backfill = require('./database-scripts/playerIDBackfillTools')

const char = require('./database-scripts/utility/charIdTools')

const weeklyUpdateTools = require('./database-scripts/weeklyUpdateTools')

const mongoose = require('mongoose')

async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_ALTERNATE_CONNECTION_STRING)
}
mongoConnect().catch((err) => console.log(err))

const Game = require('./models/game')

async function main() {
  await updateTools.processTournamentSlug(
    'tournament/late-night-show-with-redtrainer-2/event/ultimate-1v1-winners-takes-20-home'
  )

  mongoose.disconnect()
}

main()
