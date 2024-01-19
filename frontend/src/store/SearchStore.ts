import { observable, action } from "mobx";
import { ForecastPeriod, Site } from "../../../model/Weather";

export class SearchStore {
  @observable public activeSite?: Site;
  @observable.ref public savedSites: Map<string, Site> = new Map();

  public locations: Site[] = [];

  constructor() {}

  // TODO: remove
  // This is not of great value to the frontend (maybe to show some auto complete suggestions)
  // User will want to search a specific location, then get a forecast and estimated driving time to it
  public async getSiteList(forecastPeriod: ForecastPeriod, refresh = false) {
    const siteTest = await fetch("http://localhost:8080/sites");
    const sites = (await siteTest.json()) as { sites: Site[] };
    console.log("locations with three hourly forecasts: ", sites.sites);

    this.locations = sites.sites;
  }

  /* Set a single result */
  @action public setActiveSite(location: Site) {
    this.activeSite = location;
  }

  /* Load saved results */
  @action public setSavedSites(locations: Site[]) {
    locations.forEach((location) => {
      this.savedSites.set(location.id.toString(), location);
    });
  }
}
