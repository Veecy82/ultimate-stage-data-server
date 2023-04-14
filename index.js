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

async function main() {
  await updateTools.processTournamentsFromFileOfEventSize(
    './misc-data/event-entrant-pairs/2018.json',
    100
  )
  mongoose.disconnect()
}

main()
