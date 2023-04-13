require('dotenv').config()

const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

const char = require('./utility/charIdTools')

async function main() {
  const filePaths = []
  for (let i = 2018; i <= 2023; i++) {
    filePaths.push(`./misc-data/event-entrant-pairs/${i}.json`)
  }
  const allTourneys = await util.getMapFromFiles(filePaths)
  const filteredTourneys = util.filterMapByValue(
    allTourneys,
    (val) => val > 128
  )

  console.log(filteredTourneys)
}

main()
