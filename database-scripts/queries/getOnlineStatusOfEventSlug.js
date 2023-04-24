exports.query = `query GetOnlineStatusOfEventSlug($slug: String!) {
  event(slug: $slug) {
		isOnline
  }
}`.toString()
