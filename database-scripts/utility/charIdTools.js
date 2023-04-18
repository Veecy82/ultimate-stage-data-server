const fs = require('fs')

const rawData = fs.readFileSync('./misc-data/characterIdPairs.json')
const dataObj = JSON.parse(rawData)
const characters = dataObj.characters

const toName = {}
const toInternal = {}
const nameToId = {}
const internalToId = {}

for (const character of characters) {
  toName[character.id] = character.name
  toInternal[character.id] = character.internal
  nameToId[character.name] = character.id
  internalToId[character.internal] = character.id
}

exports.toName = toName
exports.toInternal = toInternal
exports.nameToId = nameToId
exports.internalToId = internalToId
