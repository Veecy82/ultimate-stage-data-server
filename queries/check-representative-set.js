exports.query = `query CheckRepresentativeSet($slug: String!) {
	event(slug: $slug){
    sets(
      perPage: 1
    	sortType: MAGIC
    	){
      nodes{
        fullRoundText
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
        }
      }
    }
  }
}`.toString()
