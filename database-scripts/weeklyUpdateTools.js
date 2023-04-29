/* miscDataTools.js
 *
 * A library of functions for handling the weekly update of the dataset
 *
 * Functions may query both Start.gg's API and USD's database through Mongoose
 */

const updateTools = require('./updateTools')
const miscDataTools = require('./miscDataTools')

/** Asynchronously complete the following steps in series:
 *
 * - Check the last 2 weeks for complete singles Ultimate tournaments, and process the ones that are not blacklisted or previously processed
 * - Check database for blacklisted games and remove any that exist
 * - Generate new MiscData object, save to database, and update the one cached on the server
 */
exports.doWeeklyUpdate = async () => {
  await updateTools.processAllTournamentsInPastNDays(28)
  await updateTools.removeGamesFromBlacklistedTournaments()
  await miscDataTools.makeAndSetCurrentMiscData()
}
