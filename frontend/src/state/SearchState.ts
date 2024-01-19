import { makeObservable, action, observable } from "mobx";
import { RootState } from "./RootState";
import { ForecastPeriod } from "../../../model/Weather";

export class SearchState {
  @observable public forecastPeriod = ForecastPeriod.THREE;

  constructor(public rootState: RootState) {
    makeObservable(this);
  }

  // TODO: remove. No need for search stuff to load on startup
  public async init() {
    console.log("init search data");
    await this.rootState.rootStore.searchStore.getSiteList(this.forecastPeriod);

    const locations = this.rootState.rootStore.searchStore.locations;

    console.log("locations ", locations);
  }

  @action public async setForecastPeriod(forecastPeriod: ForecastPeriod) {
    this.forecastPeriod = forecastPeriod;

    // Update results?
    // - should make results disabled, need to perform search again
    // await this.rootState.rootStore.searchStore.getSiteList(this.forecastPeriod);
  }

  @action public async search() {
    /*
    get location
    get time period
    call the API
    
    */
  }
}
