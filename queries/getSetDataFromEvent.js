exports.query =
  `query GetSetDataFromEvent($slug: String!, $page: Int!, $perPage: Int!) {
	event(slug: $slug){
    isOnline
    sets(
      perPage: $perPage
      page: $page
    	sortType: MAGIC
    	){
      nodes{
        id
        games {
          stage {
            name
          }
          selections {
            entrant {
              id
            }
            selectionValue
          }
          winnerId
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
}`.toString()
