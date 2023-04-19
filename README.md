# ultimate-stage-data-server

This project is intended to serve a web application giving tournament statistics of character win rates on stages in Smash  Ultimate.

All tournaments with at least 100 entrants since the release of the game have been processed, and the server is currently in development.

Sets are queried from [start.gg's GraphQL API](https://developer.start.gg/docs/intro) and processed by the server. Data is updated on the server-side weekly.