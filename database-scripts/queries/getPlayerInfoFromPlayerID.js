exports.query = `query GetPlayerInfoFromPlayerID($playerID: ID!) {
	player(id: $playerID){
  	id
    gamerTag
  }
}`.toString()
