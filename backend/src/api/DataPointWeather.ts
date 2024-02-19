import { ForecastPeriod } from "../../../model/WeatherTypes";
import { ForecastResponse } from "../../../model/DataPointTypes";

import { metOfficeEnvVars } from "../env-variables";

/**
 * DataPointWeather
 *
 * Gets 5 day forecast, or hourly observations for current 24 hour period
 * 5 day forecasts have 6000 locations
 * 24 hour observations have 150 locations
 *
 */
export class DataPointWeather {
  constructor() {}

  public async getSiteWeather(locationId = 0, forecastPeriod: ForecastPeriod): Promise<ForecastResponse | undefined> {
    if (!locationId) {
      return;
    }

    const { url, dataType, apiKey } = metOfficeEnvVars;

    // observations = 24h, hourly
    // forecasts = 5 day, 3hourly
    const observationUrl = `${url}val/wxobs/all/${dataType}${locationId}?res=hourly&key=${apiKey}`;
    const forecastUrl = `${url}val/wxfcs/all/${dataType}${locationId}?res=3hourly&key=${apiKey}`;

    const searchUrl = forecastPeriod === ForecastPeriod.THREE ? forecastUrl : observationUrl;

    const response = await fetch(searchUrl);

    if (response.ok) {
      // TODO: object mapper to avoid type casting
      const forecast = (await response.json()) as ForecastResponse;
      if (forecast) {
        return forecast;
      }
    }
    return;
  }
}
