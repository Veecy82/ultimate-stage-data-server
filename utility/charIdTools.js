const fs = require('fs')

const rawData = fs.readFileSync('./misc-data/characterIdPairs.json')
const dataObj = JSON.parse(rawData)
const characters = dataObj.characters

const toName = {}
const toId = {}

for (const character of characters) {
  toName[character.id] = character.name
  toId[character.name] = character.id
}

exports.toName = toName
exports.toId = toId
