const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MiscDataSchema = new Schema({
  timestamp: { type: Date },
  totalGameCount: { type: Number },
  totalOnlineGameCount: { type: Number },
  totalOfflineGameCount: { type: Number },
  totalEventSlugsWithData: { type: Number },
  totalEventSlugsLightlyInspected: { type: Number },
  bestWinCharName: { type: String },
  bestWinCharPct: { type: Number },
  worstWinCharName: { type: String },
  worstWinCharPct: { type: Number },
  mostGamesCharName: { type: String },
  mostGamesCharCount: { type: Number },
  leastGamesCharName: { type: String },
  leastGamesCharCount: { type: Number },
  lastTenProcessedSlugs: { type: [String] },
})

module.exports = mongoose.model('MiscData', MiscDataSchema)
