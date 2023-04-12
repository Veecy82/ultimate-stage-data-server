require('dotenv').config()

const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

async function main() {
  const period = util.portionDateRange(2019, 4, 5, 2019, 4, 7)[0]

  const slugs = await apiTools.getCompletedEventSlugsWithEntrantsInSinglePeriod(
    period[0],
    period[1]
  )

  console.log(slugs.size)
}

main()
