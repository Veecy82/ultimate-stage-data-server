# ultimate-stage-data-server

Live: https://ultimatestagedata.com

A web application serving stage-dependent statistics of character and matchup win rates from Smash Ultimate tournaments.

Sets are queried from [start.gg's GraphQL API](https://developer.start.gg/docs/intro), processed by the server, and stored in a separate database. Data is updated on the server-side each Friday.

# Running this project locally

To run this project locally, clone this repository, navigate to your local copy and run `npm install` to install required dependencies. To run the server, in a command line run
```
npm run dev
```
The server will be accessible on `localhost:3000`, and will reload upon saved file changes.

NOTE: Running this server locally requires two environment variables to be set. `START_GG_API_KEY` must be set to a valid start.gg API key and `MONGODB_CONNECTION_STRING` must be set to a connection string for a MongoDB Atlas database that allows reads and writes.

To run code snippets testing various utility scripts (like those in `/misc-data/exampleApiCalls.js`), edit `sandbox.js` to your liking and run
```
npm run sandbox
```