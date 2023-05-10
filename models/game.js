const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GameSchema = new Schema({
  winChar: { type: Number, required: true },
  loseChar: { type: Number, required: true },
  // winPlayer and losePlayer are the entrant IDs for the winning and losing entrant
  // these are not useful, and instead we should use player IDs (below)
  winPlayer: { type: Number },
  losePlayer: { type: Number },
  winPlayerId: { type: Number },
  losePlayerId: { type: Number },
  stage: { type: String, required: true },
  isOnline: { type: Boolean },
  gameId: { type: Number, required: true, unique: true },
  setId: { type: Number, required: true },
  slug: { type: String, required: true },
})

GameSchema.index({ winChar: 1 })
GameSchema.index({ winChar: 1, stage: 1 })
GameSchema.index({ loseChar: 1, stage: 1 })

module.exports = mongoose.model('Game', GameSchema)
