import { observable, action } from "mobx";
import { ForecastPeriod, Site } from "../../../model/Weather";
import { SearchResponse, ResponseStatus } from "../../../model/Api";

export class SearchStore {
  @observable public activeSite?: Site;
  @observable.ref public savedSites: Map<string, Site> = new Map();

  public locations: Site[] = [];

  constructor() {}

  // Save favourite sites in a smaller db? (rather than filtering through all of them?)
  public async getSiteInformation(queryLocation: string, forecastPeriod: ForecastPeriod, withDirections = false): Promise<SearchResponse | undefined> {
    const body = { queryLocation, forecastPeriod, withDirections };
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const siteInformation = await fetch("http://localhost:8080/search", request);
    const info = (await siteInformation.json()) as { searchResponse: SearchResponse };

    if (info.searchResponse.status !== ResponseStatus.OK) {
      return;
    }
    // TODO: tweak on backend? Not sure.
    return info.searchResponse;
  }

  // TODO: change. Not interested in Sites. This is direct data from met office
  // want to get active location, with weather data and notes
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
