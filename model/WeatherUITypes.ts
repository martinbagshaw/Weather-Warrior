/**
 * Weather UI Types
 *
 * Used by the UI Layer
 *
 */

export interface WeatherStyle {
  code: number;
  description: string;
  iconClass: string;
  aboveIconClass?: string;
  underIconClass?: string;
}

export interface Forecast {
  date: string;
  startTime: string;
  days: ForecastDay[];
}
export interface ForecastDay {
  date: string;
  startTime: string;
  intervals: ForecastInterval[];
}
export interface ForecastInterval {
  startTime: string;
  precip: string;
  temp: string;
  tempFeels: string;
  weatherInfo?: WeatherStyle;
}
