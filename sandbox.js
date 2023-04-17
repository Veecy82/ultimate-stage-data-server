// sandbox.js
// The purpose of this file is to manually test or run functions like those in apiTools, updateTools, or mongoTools

require('dotenv').config()

const apiTools = require('./database-scripts/utility/apiTools')
const updateTools = require('./database-scripts/updateTools')
const util = require('./database-scripts/utility/util')

const char = require('./database-scripts/utility/charIdTools')

const mongoose = require('mongoose')

async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
}
mongoConnect().catch((err) => console.log(err))

const Game = require('./models/game')

async function main() {
  /*  console.log(`Online games: ${await Game.countDocuments({ isOnline: true })}`)
  console.log(
    `Offline games: ${await Game.countDocuments({ isOnline: false })}`
  ) */

  await updateTools.processTournamentsFromFileOfEventSize(
    './misc-data/event-entrant-pairs/2021.json',
    100
  )

  await updateTools.processTournamentsFromFileOfEventSize(
    './misc-data/event-entrant-pairs/2022.json',
    100
  )

  mongoose.disconnect()
}

main()