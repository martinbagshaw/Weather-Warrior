import { DatabaseUtils } from "../database/DatabaseUtils";
import { ForecastPeriod, Site, SiteListResponse } from "../../../model/Weather";

import { metOfficeEnvVars } from "../env-variables";

/**
 * Sites
 *
 * returns a list of sites, or locations that have forecasts supplied by Met Office DataPoint API
 *
 * this will likely not be required by the frontend, but is needed to perform search for forecast locations
 */
export class Sites {
  constructor(private forecastPeriod = ForecastPeriod.THREE) {}

  public setForecastPeriod(forecastPeriod: ForecastPeriod) {
    this.forecastPeriod = forecastPeriod;
  }

  public async getWeatherSites(): Promise<Site[]> {
    const sites = await DatabaseUtils.getCollectionContents<Site>("sites").catch(console.error);
    const emptyDB = !sites || !sites.length;

    if (!emptyDB && sites) {
      console.log("get sites from database");
      return sites;
    } else {
      const sitesFromAPI = await this.getDataPointSites();
      if (sitesFromAPI.length) {
        await DatabaseUtils.saveCollectionContents<Site>("sites", sitesFromAPI);
        return sitesFromAPI;
      }
    }

    return [];
  }

  private async getDataPointSites(): Promise<Site[]> {
    console.log("get sites from datapoint");
    const { url, dataType, apiKey, siteList, hourly, threeHourly } = metOfficeEnvVars;

    const configTime = this.forecastPeriod === ForecastPeriod.ONE ? hourly : threeHourly;

    const siteListUrl = `${url}${configTime}${dataType}${siteList}${apiKey}`;

    const response = await fetch(siteListUrl);

    if (response.ok) {
      // TODO: object mapper to avoid type casting
      const siteList = (await response.json()) as SiteListResponse;
      const sites: Site[] = siteList?.Locations.Location;

      if (sites?.length) {
        return sites;
      }
    }
    return [];
  }
}
