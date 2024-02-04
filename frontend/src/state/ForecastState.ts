import { makeObservable, action, observable } from "mobx";

import { ForecastUtil, WeatherStyle } from "../../../utils/ForecastUtil";
import { DV, ForecastResponse } from "../../../model/Weather";

/**
 * ForecastState
 *
 * This will convert raw met office data into visual forecast for the next five days in the UI
 *
 * Results could be saved / cached to minimise API calls
 */

export interface Forecast {
  date: string;
  startTime: string;
  days: ForecastDay[];
}
export interface ForecastDay {
  date: string;
  startTime: string;
  intervals: ForecastInterval[];
}
export interface ForecastInterval {
  // startTime: string,
  precip: string;
  temp: string;
  tempFeels: string;
  weatherInfo?: WeatherStyle;
}

export class ForecastState {
  @observable public forecast?: Forecast;

  constructor(private readonly rawForecast: ForecastResponse) {
    this.init(this.rawForecast);
    makeObservable(this);
  }

  private init(rawForecast: ForecastResponse) {
    this.getForecast(rawForecast.SiteRep.DV);
  }

  @action
  private getForecast(forecastData: DV) {
    const days: ForecastDay[] = [];

    forecastData.Location.Period.forEach((day) => {
      const { value, Rep } = day;
      const intervals: ForecastInterval[] = [];

      Rep.forEach((period) => {
        const code = Number(period.W);
        const weatherInfo = ForecastUtil.getWeatherStyle(code);

        intervals.push({
          precip: period.Pp,
          temp: period.T,
          tempFeels: period.F,
          weatherInfo,
        });
      });

      const [dDate, dStartTime] = ForecastUtil.getDateTime(value);

      days.push({ date: dDate, startTime: dStartTime, intervals });
    });

    const { dataDate } = forecastData;
    const [fDate, fStartTime] = ForecastUtil.getDateTime(dataDate);

    this.forecast = { date: fDate, startTime: fStartTime, days };
  }
}
