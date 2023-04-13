const apiTools = require('../utility/apiTools')
const util = require('../utility/util')

// Write `slug, numEntrants` pairs of all completed events in 2019 to file
const slugs = await apiTools.getCompletedEventSlugsWithEntrantsInLongPeriod(
  2019,
  1,
  1,
  2020,
  1,
  1
)

await util.writeMapToJSON('./misc-data/event-entrant-pairs/2019.json', slugs)
