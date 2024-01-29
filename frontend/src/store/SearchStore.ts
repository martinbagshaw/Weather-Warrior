import { observable, action } from "mobx";
import { ForecastPeriod, SiteResponse } from "../../../model/Weather";
import { SearchResponse, ResponseStatus } from "../../../model/Api";

export class SearchStore {
  @observable public activeSite?: SiteResponse;
  @observable.ref public savedSites: Map<string, SiteResponse> = new Map();

  public locations: SiteResponse[] = [];

  constructor() {}

  // Save favourite sites in a smaller db? (rather than filtering through all of them?)
  public async getSearchResult(queryLocation: string, forecastPeriod: ForecastPeriod): Promise<SearchResponse> {
    const body = { queryLocation, forecastPeriod };
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const rawResponse = await fetch("http://localhost:8080/search", request);
    const response = (await rawResponse.json()) as { searchResponse: SearchResponse };

    return response.searchResponse;
  }

  // TODO: change. Not interested in Sites. This is direct data from met office
  // want to get active location, with weather data and notes
  /* Set a single result */
  @action public setActiveSite(location: SiteResponse) {
    this.activeSite = location;
  }

  /* Load saved results */
  @action public setSavedSites(locations: SiteResponse[]) {
    locations.forEach((location) => {
      this.savedSites.set(location.id.toString(), location);
    });
  }
}
