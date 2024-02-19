import { Rep, Site } from "./DataPointTypes";
/**
 * Weather Types
 *
 * Helps manage data from DataPoint API, converting it to a more predictable format
 * - Used by Search.ts
 *
 */

export enum ForecastPeriod {
  ONE = 1,
  THREE = 3,
}

export interface DayInterval {
  dateStamp: string;
  intervals: Rep[];
}

export interface LocationDetails {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  continent: string;
  elevation: number;
  dayForecasts: DayInterval[];
}

export interface LocationForecast {
  forecastPeriod: ForecastPeriod;
  site?: Site;
  date?: string;
  type?: string;
  locationDetails?: LocationDetails;
}
