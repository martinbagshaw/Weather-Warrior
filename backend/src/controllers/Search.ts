import { DayInterval, ForecastPeriod, LocationDetails, LocationForecast } from "../../../model/WeatherTypes";
import { ForecastResponse, Site } from "../../../model/DataPointTypes";
import { ResponseStatus, SearchRequest, SearchResponse, SearchResponseData, SearchResponseMessages } from "../../../model/Api";

import { DistanceUtil } from "../../utils/DistanceUtil";
import { SiteUtil } from "../../utils/SiteUtil";

import { DataPointSites } from "../api/DataPointSites";
import { DataPointWeather } from "../api/DataPointWeather";

/**
 * Search
 *
 * Currently gets searched location (or nearest match), and weather for 24h + 5 day period
 *
 * TODO:
 *
 * Allow user to build up supplementary data for locations, including drive time
 * Add nearby crags, and information required to calculate time period they will be in the sun
 *
 * NICE TO HAVE:
 * - auto complete / auto suggest
 * - refresh facility (/siteList may get changed)
 * - environment variables (.env)
 *
 * TO RESEARCH:
 * - configure /siteList to work with 3 hourly forecasts and mountain forecasts
 *
 */

export class Search {
  private searchSites: DataPointSites;
  private searchWeather: DataPointWeather;
  constructor() {
    this.searchSites = new DataPointSites();
    this.searchWeather = new DataPointWeather();
  }

  /*
  Improvements

  - near matches for hourly locations
  - regional, national park, mountain sitelists, e.g.
  txt/wxfcs/nationalpark/datatype/sitelist

  */
  public async getSearchResult(searchRequest: SearchRequest): Promise<SearchResponse> {
    const { queryLocation } = searchRequest;
    const searchedLocation = queryLocation.toLowerCase();

    const sitesThreeHourly = await this.searchSites.getSites(ForecastPeriod.THREE);
    const siteThreeHourly: Site | undefined = DistanceUtil.getThreeHourlySite(searchedLocation, sitesThreeHourly);

    const sitesOneHourly = await this.searchSites.getSites(ForecastPeriod.ONE);
    const siteOneHourly: Site | undefined = DistanceUtil.getHourlySite(sitesOneHourly, siteThreeHourly);

    const hourlySite = await this.addForecast(ForecastPeriod.ONE, siteOneHourly);
    const threeHourlySite = await this.addForecast(ForecastPeriod.THREE, siteThreeHourly);

    return this.formatSearchResponse(queryLocation, [hourlySite, threeHourlySite]);
  }

  private async addForecast(forecastPeriod: ForecastPeriod, site?: Site): Promise<LocationForecast> {
    const siteCode = site ? Number(site.id) : 0;
    const forecast: ForecastResponse | undefined = await this.searchWeather.getSiteWeather(siteCode, forecastPeriod);

    // Process Period and Location so it can be handled better by the frontend
    const result: LocationForecast = { forecastPeriod };

    if (forecast) {
      const { dataDate, Location, type } = forecast.SiteRep.DV;

      // Location
      const { lat, lon, name, country, continent, elevation, Period } = Location;

      const singlePeriod = !Array.isArray(Period);
      const originalPeriods = singlePeriod ? [Period] : Period;

      const dayForecasts: DayInterval[] = [];

      // Days
      originalPeriods.forEach(({ value, Rep }) => {
        // Intervals
        const singleRep = !Array.isArray(Rep);
        const originalIntervals = singleRep ? [Rep] : Rep;

        dayForecasts.push({ dateStamp: value, intervals: originalIntervals });
      });

      const locationDetails: LocationDetails = {
        latitude: Number(lat),
        longitude: Number(lon),
        name,
        country: SiteUtil.getSiteCountry(country),
        continent,
        elevation: Number(elevation),
        dayForecasts,
      };

      // Add to forecast
      result.site = site;
      result.date = dataDate;
      result.type = type;
      result.locationDetails = locationDetails;
    }

    return result;
  }

  private formatSearchResponse(location: string, locationForecasts: LocationForecast[]) {
    const searchResponse = new SearchResponse();
    const searchInformation = new SearchResponseData();

    if (!location) {
      searchResponse.message = SearchResponseMessages.NO_QUERY;
      return searchResponse;
    }

    const mainForecastSite = locationForecasts.find((l) => l.forecastPeriod === ForecastPeriod.THREE);

    // Set messages
    if (!mainForecastSite) {
      searchResponse.message = SearchResponseMessages.NO_SITE;
    }
    if (mainForecastSite && !mainForecastSite.locationDetails) {
      searchResponse.message = SearchResponseMessages.NO_FORECAST;
    }

    locationForecasts.forEach((location) => {
      searchInformation.setSite(location);
    });

    searchResponse.data = JSON.stringify(searchInformation);
    searchResponse.status = ResponseStatus.OK;

    return searchResponse;
  }
}
