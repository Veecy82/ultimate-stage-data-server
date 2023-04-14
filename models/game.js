const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GameSchema = new Schema({
  winChar: { type: Number, required: true },
  loseChar: { type: Number, required: true },
  winPlayer: { type: Number, required: true },
  losePlayer: { type: Number, required: true },
  stage: { type: String, required: true },
  isOnline: { type: Boolean },
  gameId: { type: Number, required: true, unique: true },
  setId: { type: Number, required: true },
  slug: { type: String, required: true },
})

module.exports = mongoose.model('Game', GameSchema)
