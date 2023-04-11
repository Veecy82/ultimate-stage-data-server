exports.query =
  `query FindValidTournamentsInPeriod($perPage: Int!, $page: Int!, $after: Timestamp!, $before: Timestamp!) {
  tournaments(query: {
    perPage: $perPage
    page: $page
    sortBy: "startAt asc"
    filter: {
      videogameIds: [1386]
      afterDate: $after
      beforeDate: $before
  	}
  }) {
    nodes {
      slug
      events(filter:{
        videogameId: [1386]
        type: [1]
      }) {
        state
        slug
        numEntrants
        isOnline
      }
    },
    pageInfo{
      totalPages
      total
    }
  }
}`.toString()
