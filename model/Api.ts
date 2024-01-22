import { ForecastPeriod } from "./Weather";

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
  withDirections: boolean;
}

export enum ResponseStatus {
  NOT_FOUND = 404,
  OK = 200,
}

export class SearchResponse {
  public data = "";
  public status = ResponseStatus.NOT_FOUND;
}
