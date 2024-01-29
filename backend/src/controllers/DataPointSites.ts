import { DatabaseUtils } from "../database/DatabaseUtils";
import { ForecastPeriod, SiteResponse, SiteResponseList } from "../../../model/Weather";

import { metOfficeEnvVars } from "../env-variables";

/**
 * DataPointSites
 *
 * returns a list of sites, or locations that have forecasts supplied by Met Office DataPoint API
 *
 */
export class DataPointSites {
  constructor() {}

  public async getSites(forecastPeriod: ForecastPeriod): Promise<SiteResponse[]> {
    const collectionName = `forecast-sites-period${forecastPeriod}`;
    const sites = await DatabaseUtils.getCollectionContents<SiteResponse>(collectionName).catch(console.error);
    const emptyDB = !sites || !sites.length;

    if (!emptyDB && sites) {
      console.log("got sites from database");
      return sites;
    } else {
      const sitesFromAPI = await this.getDataPointSites(forecastPeriod);
      if (sitesFromAPI.length) {
        await DatabaseUtils.saveCollectionContents<SiteResponse>(collectionName, sitesFromAPI);
        return sitesFromAPI;
      }
    }

    return [];
  }

  private async getDataPointSites(forecastPeriod: ForecastPeriod): Promise<SiteResponse[]> {
    const { url, dataType, apiKey, siteList, hourly, threeHourly } = metOfficeEnvVars;

    const configTime = forecastPeriod === ForecastPeriod.ONE ? hourly : threeHourly;

    const siteListUrl = `${url}${configTime}${dataType}${siteList}${apiKey}`;

    const response = await fetch(siteListUrl);

    if (response.ok) {
      // TODO: object mapper to avoid type casting
      const siteList = (await response.json()) as SiteResponseList;
      const sites: SiteResponse[] = siteList?.Locations.Location;

      if (sites?.length) {
        console.log("got sites from datapoint");
        return sites;
      }
    }
    return [];
  }
}
