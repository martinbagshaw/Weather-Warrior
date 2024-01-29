import { ForecastResponse } from "../../../model/Weather";

import { metOfficeEnvVars } from "../env-variables";

/**
 * DataPointWeather
 *
 * returns a forecast for a given location (site), supplied by Met Office DataPoint API
 *
 * next 5 days weather
 * {url}/wxfcs/all/{dataType}/{locationId}
 *
 * TODO:
 * previous 24 hours weather. Might just work with hourly locations, yet to find out
 * {url}/wxobs/all/datatype/{locationId}
 * ^ could be present day weather - e.g. how a forecast appears on Met Office
 *
 */
export class DataPointWeather {
  constructor() {}

  public async getSiteWeather(locationId = 0): Promise<ForecastResponse | undefined> {
    if (!locationId) {
      return;
    }

    const { url, dataType, apiKey } = metOfficeEnvVars;

    const siteWeatherUrl = `${url}val/wxfcs/all/${dataType}${locationId}?res=3hourly&key=${apiKey}`;

    const response = await fetch(siteWeatherUrl);

    if (response.ok) {
      // TODO: object mapper to avoid type casting
      const forecast = (await response.json()) as ForecastResponse;
      console.log("forecast ", forecast);

      // Need to decide whether to process this data here, or on frontend

      if (forecast) {
        // Each period = 1 day
        forecast.SiteRep.DV.Location.Period.forEach((p) => {
          console.log("p type", p.type);
          console.log("p date & time", p.value);
          // 8 reps per 3 hour period - 8x3 = 24
          console.log("rep count", p.Rep.length);
        });

        return forecast;
      }
    }
    return;
  }
}
