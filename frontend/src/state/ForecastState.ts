import { makeObservable, action, observable } from "mobx";

import { ForecastResponse } from "../../../model/Weather";

/**
 * ForecastState
 *
 * This will convert raw met office data into visual forecast for the next five days in the UI
 *
 * Results could be saved / cached to minimise API calls
 */
export class ForecastState {
  @observable public name = "";

  constructor(private readonly rawForecast: ForecastResponse) {
    this.init(this.rawForecast);
    makeObservable(this);
  }

  private init(rawForecast: ForecastResponse) {
    console.log("rawForecast", rawForecast);
    const { name } = rawForecast.SiteRep.DV.Location;
    this.setName(name);
  }

  @action public setName(name: string) {
    this.name = name;
  }
}
