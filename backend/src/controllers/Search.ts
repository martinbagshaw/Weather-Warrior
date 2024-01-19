/**
 * Search
 * 
 *
 * val/wxfcs/all/datatype/${locationId} - forecast for next 5 days including today
  val/wxobs/all/datatype/${locationId} - weather for last 24 hours

  a) two APIS: user clicks search button, then:
  - sends location id to the met office api
  - if their current location is configured, send this to directions api.
    - could save a general drive time to database, or provide option to call api for up to date drive time
  
    b) as weather data is always changing, no point in saving results (though some locations change 3 hourly only)
  - Could be an improvement here
  - Is there a way to know when results are updated?
  
  c) results are returned to the frontend
  - need to format forecast etc
  
  d) provide interface for user to build up supplementary data for locations
  - this can be searched in more detail in the future
*/

/*

a) frontend requests siteList (sends settings)
b) backend checks mongo db for data
i) if found, returns data to frontend
ii) if not found, calls met office api, checks response, saves data to mongo, then returns to frontend
c) frontend uses data for searching locations
- perhaps a location should be found from the list on the backend first?
- can i do some stuff with elastic maybe? free version?
- maybe check out data structures course, find a more efficient search thing
- need to implement an autocomplete (using the above point)

*/
export class Search {
  constructor() {}
}
