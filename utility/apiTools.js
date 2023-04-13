const axios = require('axios')

const util = require('../utility/util')

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
 * @param {string} logMessage - An optional log message passed to `console.log` when making the query
 */
exports.makeGraphQLRequest = async (query, variables, logMessage) => {
  console.log(`Sending request... ${logMessage || ''}`)
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
    console.log('Error making GraphQL request')
    if (e.response) {
      console.log('Although a connection with Start.gg was made:')
      if (e.response.data) {
        console.log(e.response.data)
      }
    } else {
      console.log('Failed to connect to Start.gg API')
    }
    throw e
  }
}

/** A wrapper for `makeGraphQLRequest`
 *
 * Asynchronously make a request to Start.gg's GraphQL API, retrying up to `n` total tries in the event of a failed query
 *
 * Parameters are the same as for `makeGraphQLRequest`, except
 * @param {number} n - The maximum number of attempts to make the request
 * @param {number} delayBetweenQueries - The amount of time between reattempted queries
 */
exports.makeGraphQLRequestUpToNTimes = async (
  query,
  variables,
  n,
  delayBetweenQueries,
  logMessage
) => {
  let err
  for (let i = 0; i < n; i++) {
    try {
      if (i > 0) {
        console.log('Retrying...')
      }
      return await this.stallPromise(
        this.makeGraphQLRequest(query, variables, logMessage),
        delayBetweenQueries
      )
    } catch (e) {
      await this.stallPromise(null, delayBetweenQueries)
      err = e
    }
  }
  console.log(`Failed to make GraphQL request even with ${n} tries`)
  if (err) {
    throw err
  }
}

/** A specific case of `makeGraphQLRequestUpToNTimes`
 *
 * Asynchronously make a request to Start.gg's GraphQL API, retrying up to 5 total tries in the event of a failed query
 *
 * @param {string} query - The GraphQL query
 * @param {Object} variables - An object whose key: value pairs give the variables for the query
 * @param {number} delayBetweenQueries - The amount of time between reattempted queries
 * @param {string} logMessage - An optional log message passed to `console.log` when making the query
 */
exports.makeGraphQLRequestStubborn = async (
  query,
  variables,
  delayBetweenQueries,
  logMessage
) => {
  return await this.makeGraphQLRequestUpToNTimes(
    query,
    variables,
    5,
    delayBetweenQueries,
    logMessage
  )
}

/** Asynchronously return a boolean indicating whether a representative set of the given event has stage data
 *
 * Set representatitive is chosen by the `MAGIC` sort type in Start.gg's GraphQL API
 *
 * GraphQL queries made: 1
 */
exports.eventSlugRepresentativeHasStageData = async (slug) => {
  const response = await this.makeGraphQLRequestStubborn(
    checkRepresentativeSet.query,
    {
      slug,
    },
    2
  )
  try {
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
  if (event.state === 'COMPLETED' && event.numEntrants >= 48) {
    return true
  }
}

/** Asynchronously return an array of slugs of events satisfying the condition `this.eventIsValid`
 *
 * Should only be used with "single periods," ie monthlong periods at most to prevent bumping up against Start.GG's API query limits (longer time periods should be chained calls of this function)
 *
 * GraphQL queries made: 1-40+
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
      console.log('Oops! Error')
    }
  }

  let response = await this.stallPromise(
    this.makeGraphQLRequestStubborn(
      findValidTournamentsInPeriod.query,
      {
        perPage: tournamentsPerPage,
        page: 1,
        after: unixStart,
        before: unixEnd,
      },
      delayBetweenQueries,
      '(1 of ?)'
    ),
    delayBetweenQueries
  )
  let lastPage
  try {
    lastPage = response.tournaments.pageInfo.totalPages
  } catch (e) {
    console.log("Couldn't find number of pages for some reason")
    throw e
  }

  handleResponse(response)

  for (let i = 2; i <= lastPage; i++) {
    response = await this.stallPromise(
      this.makeGraphQLRequestStubborn(
        findValidTournamentsInPeriod.query,
        {
          perPage: tournamentsPerPage,
          page: i,
          after: unixStart,
          before: unixEnd,
        },
        delayBetweenQueries,
        `(${i} of ${lastPage})`
      ),
      delayBetweenQueries
    )
    handleResponse(response)
  }

  return validSlugs
}

/** Asynchronously return a map of `slug, numEntrants` pairs of events in a single time period */
exports.getCompletedEventSlugsWithEntrantsInSinglePeriod = async (
  unixStart,
  unixEnd
) => {
  const slugs = new Map()
  const tournamentsPerPage = 50
  // delay in seconds
  const delayBetweenQueries = 3

  const handleResponse = (res) => {
    try {
      for (const tournament of res.tournaments.nodes) {
        for (const event of tournament.events) {
          if (event.state === 'COMPLETED') {
            slugs.set(event.slug, event.numEntrants)
          }
        }
      }
    } catch (e) {
      console.log('Oops! Error')
    }
  }

  let response = await this.stallPromise(
    this.makeGraphQLRequestStubborn(
      findValidTournamentsInPeriod.query,
      {
        perPage: tournamentsPerPage,
        page: 1,
        after: unixStart,
        before: unixEnd,
      },
      delayBetweenQueries,
      '(1 of ?)'
    ),
    delayBetweenQueries
  )
  let lastPage
  try {
    lastPage = response.tournaments.pageInfo.totalPages
  } catch (e) {
    console.log("Couldn't find number of pages for some reason")
    throw e
  }

  handleResponse(response)

  for (let i = 2; i <= lastPage; i++) {
    response = await this.stallPromise(
      this.makeGraphQLRequestStubborn(
        findValidTournamentsInPeriod.query,
        {
          perPage: tournamentsPerPage,
          page: i,
          after: unixStart,
          before: unixEnd,
        },
        delayBetweenQueries,
        `(${i} of ${lastPage})`
      ),
      delayBetweenQueries
    )
    handleResponse(response)
  }

  return slugs
}

/** Asynchronously return a map of `slug, numEntrants` pairs of events in an arbitrary time period
 *
 * As implemented, tournaments may be up to 4 days before or 4 days after the given range as a measure to prevent missing tournaments that lie on the boundary of adjacent queries
 *
 * e.g. querying
 *
 * "June 3rd, 2019 to January 1st, 2020"
 * and
 * "January 1st, 2020 to April 9th, 2020"
 *
 * would miss a tournament that ran from December 29th, 2019 to January 6th, 2020 if it wasn't implemented this way
 */
exports.getCompletedEventSlugsWithEntrantsInLongPeriod = async (
  yStart,
  mStart,
  dStart,
  yEnd,
  mEnd,
  dEnd
) => {
  const periods = util.portionDateRange(
    yStart,
    mStart,
    dStart,
    yEnd,
    mEnd,
    dEnd
  )

  const fourDays = 4 * 24 * 60 * 60
  const allSlugs = new Map()

  let i = 1
  for (const period of periods) {
    console.log(`Gathering data -- batch ${i++} of ${periods.length}`)
    // offset start and end by four days, so that any tournament lasting less than 8 days on their boundary is caught by at least one of them
    const start = period[0] - fourDays
    const end = period[1] + fourDays
    const periodSlugs =
      await this.getCompletedEventSlugsWithEntrantsInSinglePeriod(start, end)
    for (const [key, value] of periodSlugs) {
      allSlugs.set(key, value)
    }
  }
  return allSlugs
}
