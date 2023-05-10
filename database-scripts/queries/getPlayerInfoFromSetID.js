exports.query = `query GetPlayerInfoFromSetID($setID: ID!) {
	set(id: $setID){
		slots {
      entrant {
        id
        participants {
          player {
            id
            gamerTag
          }
        }
      }
    }
  }
}`.toString()
