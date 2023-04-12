require('dotenv').config()

const apiTools = require('./utility/apiTools')
const util = require('./utility/util')

async function main() {
  const period = util.portionDateRange(2019, 1, 1, 2019, 1, 7)[0]

  console.log(
    await apiTools.findValidEventSlugsInSinglePeriod(period[0], period[1])
  )
}

main()
