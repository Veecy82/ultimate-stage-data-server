const axios = require('axios')

const checkRepresentativeSet = require('../queries/check-representative-set')

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
    console.log('Done waiting')
    return res.data.data
  } catch (e) {
    console.log('Error making GraphQL request:')
    console.log(e)
    console.log('Error making GraphQL request')
  }
}

/** Asynchronously return a boolean representing whether a representative set of the given event has stage data
 *  Set representatitive is chosen by the 'MAGIC' sort type in Start.gg's GraphQL API
 *
 *  GraphQL queries made: 1
 */
exports.eventSlugRepresentativeHasStageData = async (slug) => {
  const response = await this.makeGraphQLRequest(checkRepresentativeSet.query, {
    slug,
  })
  try {
    console.log(response.event.sets.nodes)
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
