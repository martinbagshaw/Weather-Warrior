import { ForecastResponse, SiteResponse } from "../../../model/Weather";
import { ResponseStatus, SearchRequest, SearchResponse, SearchResponseData, SearchResponseMessages } from "../../../model/Api";
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

  public async getSearchResult(searchRequest: SearchRequest): Promise<SearchResponse> {
    const { queryLocation, forecastPeriod } = searchRequest;

    const searchedLocation = queryLocation.toLowerCase();
    const sites = await this.searchSites.getSites(forecastPeriod);

    const searchedSite: SiteResponse | undefined = sites.find((s) => s.name.toLowerCase() === searchedLocation);

    // Gets weather for the next 5 days, 3 hourly intervals
    // TODO: get current day weather, hourly intervals
    const siteForecast: ForecastResponse | undefined = await this.searchWeather.getSiteWeather(searchedSite?.id);

    return this.createResponse(queryLocation, searchedSite, siteForecast);
  }

  private createResponse(queryLocation: string, site?: SiteResponse, forecast?: ForecastResponse): SearchResponse {
    const searchResponse = new SearchResponse();
    const searchInformation = new SearchResponseData();

    if (!queryLocation) {
      searchResponse.message = SearchResponseMessages.NO_QUERY;
      return searchResponse;
    }

    if (site) {
      searchInformation.setSiteInformation(site);
    }

    if (forecast) {
      const { country } = forecast.SiteRep.DV.Location;
      searchInformation.setSiteCountry(country);
      searchInformation.setSiteForecast(forecast);
    }

    if (!site) {
      searchResponse.message = SearchResponseMessages.NO_SITE;
    }

    if (site && !forecast) {
      searchResponse.message = SearchResponseMessages.NO_FORECAST;
    }

    searchResponse.data = JSON.stringify(searchInformation);
    searchResponse.status = ResponseStatus.OK;

    return searchResponse;
  }
}
