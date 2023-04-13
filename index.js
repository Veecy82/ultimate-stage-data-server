require('dotenv').config()

const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

async function main() {
  const year = 2023

  const slugs = await apiTools.getCompletedEventSlugsWithEntrantsInLongPeriod(
    year,
    1,
    1,
    year + 1,
    1,
    1
  )

  await util.writeMapToJSON(`./misc-data/eventEntrantPairs/${year}.json`, slugs)
}

main()
