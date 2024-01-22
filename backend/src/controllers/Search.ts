import { Site } from "../../../model/Weather";
import { SearchRequest, SearchResponse, ResponseStatus } from "../../../model/Api";
import { DataPointSites } from "./DataPointSites";
import { DataPointWeather } from "./DataPointWeather";

/**
 * Search
 *
 * 1. Get searched location ID
 * 2. Send location ID to DataPoint API to get the forecast for the next 5 days
 *
 * TODO:
 *
 * 3. Return above results to the frontend
 * 4. Provide interface for user to add their starting location
 * 5. Get directions and drive time (Directions API)
 * 6. Provide interface for user to build up supplementary data for locations
 * 7. Add nearby crags, and information required to calculate time period they will be in the sun
 *
 * NICE TO HAVE:
 * - auto complete / auto suggest
 * - refresh facility (/siteList may get changed)
 * - environment variables (.env)
 *
 * TO RESEARCH:
 * - configure /siteList to work with 3 hourly forecasts and mountain forecasts
 *
 *
 */

export class Search {
  private searchSites: DataPointSites;
  private searchWeather: DataPointWeather;
  constructor() {
    this.searchSites = new DataPointSites();
    this.searchWeather = new DataPointWeather();
  }

  public async getSiteInformation(searchRequest: SearchRequest): Promise<SearchResponse> {
    const searchResponse = new SearchResponse();

    const { queryLocation, forecastPeriod, withDirections } = searchRequest;

    if (!queryLocation) {
      return searchResponse;
    }

    const searchTerm = queryLocation.toLowerCase();
    const sites = await this.searchSites.getSites(forecastPeriod);
    const searchSite: Site | undefined = sites.find((s) => s.name.toLowerCase() === searchTerm);

    if (!searchSite) {
      return searchResponse;
    }
    // TODO: combine searchSite with weather, and then directions
    // - searchSite contains lat, long, and better name format, as well as elevation and region
    // console.log("searchSite", searchSite);

    // Gets weather for the next 5 days:
    const siteForecast = await this.searchWeather.getSiteWeather(searchSite.id);
    if (siteForecast) {
      searchResponse.data = JSON.stringify(siteForecast);
      searchResponse.status = ResponseStatus.OK;
    }

    // TODO: call directions API

    return searchResponse;
  }
}