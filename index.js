require('dotenv').config()

const apiTools = require('./database-scripts/utility/apiTools')
const updateTools = require('./database-scripts/updateTools')

const char = require('./database-scripts/utility/charIdTools')

const mongoose = require('mongoose')
async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
}
mongoConnect().catch((err) => console.log(err))

async function main() {
  await updateTools.processTournamentSlug(
    'tournament/hex-smash-edition-v8/event/ultimate-singles'
  )
  mongoose.disconnect()
}

main()
