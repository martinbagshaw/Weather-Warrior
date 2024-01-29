import { makeObservable, action, observable } from "mobx";

import { RootState } from "./RootState";
import { ForecastPeriod, ForecastResponse } from "../../../model/Weather";

import { ForecastState } from "./ForecastState";
import { ResponseStatus, SearchResponseData, SearchResponseMessages } from "../../../model/Api";
import { LocationState } from "./LocationState";

/**
 * SearchState
 *
 * Handle search form state, and request data to the server
 * If search results are not in sync with settings in the form, this will be used to indicate this in the UI
 */
export class SearchState {
  // TODO: remove. One hour intervals = current 24 hour period. See met office forecast for reference.
  @observable public forecastPeriod = ForecastPeriod.THREE;
  @observable public queryLocation = "";
  @observable public warningMessage = SearchResponseMessages.OK;

  @observable public forecastState?: ForecastState;
  @observable public locationState?: LocationState;

  constructor(public rootState: RootState) {
    makeObservable(this);
  }

  @action public setQueryLocation(queryLocation: string) {
    this.queryLocation = queryLocation;

    this.warningMessage = SearchResponseMessages.OK;
  }

  @action public async setForecastPeriod(forecastPeriod: ForecastPeriod) {
    this.forecastPeriod = forecastPeriod;

    // TODO:
    // - make results disabled when settings change
    // - let the user know they need to perform the search again
    // await this.rootState.rootStore.searchStore.getSiteList(this.forecastPeriod);
  }

  @action public async search() {
    if (!this.queryLocation) {
      this.warningMessage = SearchResponseMessages.NO_QUERY;
      return;
    }

    const { data, message, status } = await this.rootState.rootStore.searchStore.getSearchResult(this.queryLocation, this.forecastPeriod);

    this.warningMessage = message;

    if (status === ResponseStatus.NOT_FOUND) {
      return;
    }

    const { siteResponse, siteCountry, forecastResponse } = JSON.parse(data) as SearchResponseData;

    // Will contain user contributed data, saved in mongodb
    if (siteResponse) {
      this.locationState = new LocationState(siteResponse, siteCountry);
    }

    // Will contain DataPoint forecast
    if (forecastResponse) {
      this.forecastState = new ForecastState(forecastResponse);
    }
  }
}
