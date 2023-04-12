const axios = require('axios')

const checkRepresentativeSet = require('../queries/check-representative-set')
const findValidTournamentsInPeriod = require('../queries/find-valid-tournaments-in-period')

/** Given a Promise `prom`, return a Promise that resolves to the same value as `prom` after it resolves, or after n seconds, whichever is longer */
exports.stallPromise = async (prom, n) => {
  const nSecondPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('blah')
    }, n * 1000)
  })

  const pAll = await Promise.all([prom, nSecondPromise])
  return pAll[0]
}

/** Asynchronously make a request to Start.gg's GraphQL API
 * @param {string} query - The GraphQL query
 * @param {Object} variables - An object whose key: value pairs give the variables for the query
 */
exports.makeGraphQLRequest = async (query, variables) => {
  console.log('Sending request...')
  try {
    const res = await axios.post(
      'https://api.start.gg/gql/alpha',
      { query, variables },
      {
        headers: {
          'content-type': 'text/json',
          Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
        },
      }
    )
    return res.data.data
  } catch (e) {
    console.log('Error making GraphQL request:')
    console.log(e)
    console.log('Error making GraphQL request')
  }
}

/** Asynchronously return a boolean representing whether a representative set of the given event has stage data
 *
 * Set representatitive is chosen by the `MAGIC` sort type in Start.gg's GraphQL API
 *
 * GraphQL queries made: 1
 */
exports.eventSlugRepresentativeHasStageData = async (slug) => {
  const response = await this.makeGraphQLRequest(checkRepresentativeSet.query, {
    slug,
  })
  try {
    // console.log(response.event.sets.nodes)
    const stageName = response.event.sets.nodes[0].games[0].stage.name
    const charId =
      response.event.sets.nodes[0].games[0].selections[0].selectionValue
    if (stageName && charId) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

/** Return a boolean representing whether a given event should be considered to be processed
 *
 * As queried on Start.gg's API, `event` can be expected to have the following properties:
 * - `state`
 * - `slug`
 * - `numEntrants`
 * - `isOnline`
 */
exports.eventIsValid = (event) => {
  if (event.state === 'COMPLETED' && event.numEntrants >= 150) {
    return true
  }
}

/** Return list of slugs of events satisfying the condition `this.eventIsValid`
 *
 * Should only be used with "single periods," ie monthlong periods at most to prevent bumping up against Start.GG's API query limits (longer time periods should be chained calls of this function)
 *
 * Example usage:
 *
 * `const period = util.portionDateRange(2019, 1, 1, 2019, 1, 7)[0]`
 *
 * `console.log(await apiTools.findValidEventSlugsInSinglePeriod(period[0], period[1]))`
 */
exports.findValidEventSlugsInSinglePeriod = async (unixStart, unixEnd) => {
  const validSlugs = []
  const tournamentsPerPage = 50
  // delay in seconds
  const delayBetweenQueries = 2

  const handleResponse = (res) => {
    try {
      for (const tournament of res.tournaments.nodes) {
        for (const event of tournament.events) {
          if (this.eventIsValid(event)) {
            validSlugs.push(event.slug)
          }
        }
      }
    } catch (e) {
      console.log(e)
      console.log('Oops! Error')
    }
  }

  let response = await this.stallPromise(
    this.makeGraphQLRequest(findValidTournamentsInPeriod.query, {
      perPage: tournamentsPerPage,
      page: 1,
      after: unixStart,
      before: unixEnd,
    }),
    delayBetweenQueries
  )
  let lastPage
  try {
    lastPage = response.tournaments.pageInfo.totalPages
  } catch (e) {
    console.log(e)
    console.log("Couldn't find number of pages for some reason")
  }

  handleResponse(response)

  for (let i = 2; i <= lastPage; i++) {
    response = await this.stallPromise(
      this.makeGraphQLRequest(findValidTournamentsInPeriod.query, {
        perPage: tournamentsPerPage,
        page: i,
        after: unixStart,
        before: unixEnd,
      }),
      delayBetweenQueries
    )
    handleResponse(response)
  }

  return validSlugs
}
