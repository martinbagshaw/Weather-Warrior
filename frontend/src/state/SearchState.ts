import { makeObservable, action, observable } from "mobx";
import { RootState } from "./RootState";
import { ForecastPeriod, ForecastResponse } from "../../../model/Weather";
import { ForecastState } from "./ForecastState";

/**
 * SearchState
 *
 * Handle search form state, and request data to the server
 * If search results are not in sync with settings in the form, this will be used to indicate this in the UI
 */
export class SearchState {
  @observable public forecastPeriod = ForecastPeriod.THREE;
  @observable public queryLocation = "";
  @observable public locationWarning = false;

  @observable public forecastState?: ForecastState;

  constructor(public rootState: RootState) {
    makeObservable(this);
  }

  public warningMessage() {
    if (this.locationWarning && !this.queryLocation) {
      return "Please enter a location";
    }
    if (this.locationWarning && this.queryLocation) {
      return "Location not found";
    }
    return "";
  }

  @action public setQueryLocation(queryLocation: string) {
    this.queryLocation = queryLocation;

    if (this.locationWarning) {
      this.locationWarning = false;
    }
  }

  @action public async setForecastPeriod(forecastPeriod: ForecastPeriod) {
    this.forecastPeriod = forecastPeriod;

    // TODO:
    // - make results disabled when settings change
    // - let the user knowneed to perform search again
    // await this.rootState.rootStore.searchStore.getSiteList(this.forecastPeriod);
  }

  @action public async search() {
    if (!this.queryLocation) {
      this.locationWarning = true;
      return;
    }

    // TODO: include directions
    // - if so, shape of siteInformation will have to change
    const siteInformation = await this.rootState.rootStore.searchStore.getSiteInformation(this.queryLocation, this.forecastPeriod, false);

    if (!siteInformation) {
      this.locationWarning = true;
      return;
    }

    const rawForecast = JSON.parse(siteInformation.data) as ForecastResponse;
    this.forecastState = new ForecastState(rawForecast);
  }
}
