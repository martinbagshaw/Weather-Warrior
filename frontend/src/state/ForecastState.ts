import { makeObservable, action, observable } from "mobx";

import { ForecastUtil, WeatherStyle } from "../../../utils/ForecastUtil";
import { DayInterval, ForecastPeriod, LocationForecast } from "../../../model/WeatherTypes";
import { DV, Period } from "../../../model/DataPointTypes";
/**
 * ForecastState
 *
 * This will convert raw met office data into visual forecast for the next five days in the UI
 *
 * TODO:
 * - Show a distance of observation to forecast
 * - Show location for observation and forecast
 */

// Shared with UI layer. UIInterfaces?
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
  startTime: string;
  precip: string;
  temp: string;
  tempFeels: string;
  weatherInfo?: WeatherStyle;
}

export class ForecastState {
  @observable public obsDays = 0;
  @observable public forecast?: Forecast;

  constructor(private readonly locationForecasts: LocationForecast[]) {
    this.init();
    makeObservable(this);
  }

  private init() {
    const hourlyObservation = this.locationForecasts.find((l) => l.forecastPeriod === ForecastPeriod.ONE);
    const mainForecast = this.locationForecasts.find((l) => l.forecastPeriod === ForecastPeriod.THREE);

    if (hourlyObservation && mainForecast) {
      this.mergeForecastObservation(hourlyObservation, mainForecast);
    }

    if (!hourlyObservation && mainForecast) {
      this.getForecast(mainForecast);
    }
  }

  @action
  private setObsDays(obsDays: number) {
    this.obsDays = obsDays;
  }

  /*
  TODO:

  something is clearly wrong here
  - need to look at dataDate property of observation data before merging data and adding time labels
  - shows observation for previous day + part current day
  - ... then skips a day and shows 3 days
  
  */

  @action
  private mergeForecastObservation(observationData: LocationForecast, forecastData: LocationForecast) {
    const hourlyForecasts = observationData.locationDetails?.dayForecasts ?? [];
    const threeHourlyForecasts = forecastData.locationDetails?.dayForecasts ?? [];
    const obsDays = hourlyForecasts.length;
    const forDays = threeHourlyForecasts.length;

    const threeHourlyDays = threeHourlyForecasts.slice(obsDays, forDays);

    this.setObsDays(obsDays);

    // Hourly + Three hourly
    const mergedOriginalDays = [...hourlyForecasts, ...threeHourlyDays];
    const days = this.getDaysData(mergedOriginalDays);

    const [fDate, fStartTime] = ForecastUtil.getDateTime(forecastData.date);

    this.forecast = { date: fDate, startTime: fStartTime, days };
  }

  @action
  private getForecast(forecastData: LocationForecast) {
    const threeHourlyForecasts = forecastData.locationDetails?.dayForecasts ?? [];

    const days = this.getDaysData(threeHourlyForecasts);
    const [fDate, fStartTime] = ForecastUtil.getDateTime(forecastData.date);

    this.forecast = { date: fDate, startTime: fStartTime, days };
  }

  private getDaysData(dayIntervals: DayInterval[]) {
    const forecastDays: ForecastDay[] = [];

    dayIntervals.forEach((day) => {
      const { dateStamp, intervals } = day;
      const forecastIntervals: ForecastInterval[] = [];

      intervals.forEach((period, index) => {
        const code = Number(period.W);
        const weatherInfo = ForecastUtil.getWeatherStyle(code);
        const startTime = ForecastUtil.getStartTime(intervals.length, index, true);

        forecastIntervals.push({
          startTime,
          precip: period.Pp,
          temp: period.T,
          tempFeels: period.F,
          weatherInfo,
        });
      });

      const [dDate, dStartTime] = ForecastUtil.getDateTime(dateStamp);

      forecastDays.push({ date: dDate, startTime: dStartTime, intervals: forecastIntervals });
    });

    return forecastDays;
  }
}
