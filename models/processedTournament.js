const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProcessedTournamentSchema = new Schema({
  slug: { type: String, required: true, unique: true },
})

module.exports = mongoose.model(
  'ProcessedTournament',
  ProcessedTournamentSchema
)
