exports.query = `query GetEventSlugsFromTournamentSlug($slug: String!) {
  tournament(slug: $slug) {
  	events(
      filter: {
        videogameId: [1386]
      }
    ) {
      slug
    }
  }
}`.toString()
