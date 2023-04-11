require('dotenv').config()

const apiTools = require('./utility/apiTools')

async function main() {
  const slug = 'tournament/magical-outlaws-61/event/ultimate-singles-weekly-42'

  console.log(`The event ${slug} has losers finals stage data:`)
  console.log(await apiTools.eventSlugRepresentativeHasStageData(slug))
}

main()
