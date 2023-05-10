exports.query = `query GetPlayerInfoFromEntrantID($entrantID: ID!) {
	entrant(id: $entrantID){
    participants {
      player{
        id
        gamerTag
      }
    }
  }
}`.toString()
