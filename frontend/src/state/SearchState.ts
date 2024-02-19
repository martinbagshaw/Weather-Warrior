import { makeObservable, action, observable } from "mobx";

import { RootState } from "./RootState";
import { ForecastPeriod } from "../../../model/WeatherTypes";

import { ForecastState } from "./ForecastState";
import { ResponseStatus, SearchResponseData, SearchResponseMessages } from "../../../model/Api";
import { LocationState } from "./LocationState";

/**
 * SearchState
 *
 * Handle search form state, and request data to the server
 * If search results are not in sync with settings in the form, this will be used to indicate this in the UI
 *
 */
export class SearchState {
  @observable public queryLocation = "";
  @observable public warningMessage = SearchResponseMessages.OK;

  @observable public forecastState?: ForecastState;
  @observable public locationState?: LocationState;

  constructor(public rootState: RootState) {
    makeObservable(this);
  }

  // TODO:
  // - make results disabled when settings change (e.g. location)
  // - let the user know they need to perform the search again
  @action public setQueryLocation(queryLocation: string) {
    this.queryLocation = queryLocation;

    this.warningMessage = SearchResponseMessages.OK;
  }

  @action public async search() {
    if (!this.queryLocation) {
      this.warningMessage = SearchResponseMessages.NO_QUERY;
      return;
    }

    const { data, message, status } = await this.rootState.rootStore.searchStore.getSearchResult(this.queryLocation);

    this.warningMessage = message;

    if (status === ResponseStatus.NOT_FOUND) {
      return;
    }

    const { locationForecasts } = JSON.parse(data) as SearchResponseData;

    const mainForecastSite = locationForecasts.find((s) => s.forecastPeriod === ForecastPeriod.THREE);
    if (mainForecastSite) {
      this.locationState = new LocationState(mainForecastSite);
      // TODO:
      // add user contributed data, saved in mongodb
    }

    // Will contain DataPoint forecast
    if (locationForecasts.length) {
      this.forecastState = new ForecastState(locationForecasts);
    }
  }
}
