import { ForecastPeriod, ForecastResponse, SiteResponse } from "./Weather";

/**
 * API request and response objects, shared between frontend and backend
 *
 * - perhaps this should be refined more on the backend before being sent to frontend
 * - though if just used for styling, perhaps best handled on frontend
 *
 */

export interface SearchRequest {
  queryLocation: string;
  forecastPeriod: ForecastPeriod;
}

export enum ResponseStatus {
  NOT_FOUND = 404,
  OK = 200,
}

export enum SearchResponseMessages {
  NO_QUERY = "Please enter a location",
  NO_SITE = "Location not found",
  NO_FORECAST = "Forecast not found",
  OK = "",
}

export class SearchResponse {
  public data = "";
  public message = SearchResponseMessages.OK;
  public status = ResponseStatus.NOT_FOUND;
}

export class SearchResponseData {
  // Site
  public siteResponse?: SiteResponse;
  public siteCountry = "";

  // Forecast
  public forecastResponse?: ForecastResponse;

  /*
  User notes
  - type of climbing, buttresses
  - these will come from mongo

  Calculated data
  - time crag(s) in the sun
  
  */

  constructor() {}

  public setSiteInformation(siteResponse: SiteResponse) {
    this.siteResponse = siteResponse;
  }

  // Comes from Forecast
  // - will have to re-write database for this to work
  public setSiteCountry(siteCountry: string) {
    const countryWords: string[] = [];
    siteCountry.split(" ").forEach((w) => {
      const firstLetter = w.charAt(0);
      const remainingLetters = w.toLowerCase().substring(1);
      countryWords.push(`${firstLetter}${remainingLetters}`);
    });

    this.siteCountry = countryWords.join(" ");
  }

  public setSiteForecast(forecastResponse: ForecastResponse) {
    this.forecastResponse = forecastResponse;
    // convert this into something more readable
    /*

    key (will likely always be the same)
    data (5 day forecast)
    
    */
  }
}
