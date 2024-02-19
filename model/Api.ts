import { SiteUtil } from "../backend/utils/SiteUtil";
import { LocationForecast } from "./WeatherTypes";

/**
 * API request and response objects, shared between frontend and backend
 *
 */

export interface SearchRequest {
  queryLocation: string;
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
  public locationForecasts: LocationForecast[] = [];

  constructor() {}

  public setSite(locationForecast: LocationForecast) {
    this.locationForecasts.push(locationForecast);
  }

  /*
  public setUserInfo(){}

  User notes
  - type of climbing, buttresses
  - these will come from mongo

  Calculated data
  - time crag(s) in the sun
  
  */
}
