import { makeObservable, action, observable } from "mobx";

import { ForecastUtil } from "../../../utils/ForecastUtil";
import { DayInterval, ForecastPeriod, LocationForecast } from "../../../model/WeatherTypes";
import { Forecast, ForecastDay, ForecastInterval } from "../../../model/WeatherUITypes";
/**
 * ForecastState
 *
 * This will convert raw met office data into visual forecast for the next five days in the UI
 *
 * TODO:
 * - Show a distance of observation to forecast
 * - Show location for observation and forecast
 */

export class ForecastState {
  @observable public forecast?: Forecast;

  constructor(private readonly locationForecasts: LocationForecast[]) {
    this.init();
    makeObservable(this);
  }

  private init() {
    const hourlyObservation = this.locationForecasts.find(
      (l) => l.forecastPeriod === ForecastPeriod.ONE
    );
    const mainForecast = this.locationForecasts.find(
      (l) => l.forecastPeriod === ForecastPeriod.THREE
    );

    if (hourlyObservation && mainForecast) {
      this.mergeForecastObservation(hourlyObservation, mainForecast);
    }

    if (!hourlyObservation && mainForecast) {
      this.getForecast(mainForecast);
    }
  }

  @action
  private mergeForecastObservation(
    observationData: LocationForecast,
    forecastData: LocationForecast
  ) {
    const hourlyForecasts = observationData.locationDetails?.dayForecasts ?? [];
    const threeHourlyForecasts = forecastData.locationDetails?.dayForecasts ?? [];

    // Hourly + Three hourly
    const days = ForecastUtil.mergeObservationForecastDays2(hourlyForecasts, threeHourlyForecasts);

    const [date, startTime] = ForecastUtil.getDateTime(forecastData.date);

    this.forecast = { date, startTime, days };
  }

  @action
  private getForecast(forecastData: LocationForecast) {
    const threeHourlyForecasts = forecastData.locationDetails?.dayForecasts ?? [];

    const days = this.getThreeHourlyForecastDays(threeHourlyForecasts);
    const [date, startTime] = ForecastUtil.getDateTime(forecastData.date);

    this.forecast = { date, startTime, days };
  }

  private getThreeHourlyForecastDays(dayIntervals: DayInterval[]) {
    const forecastDays: ForecastDay[] = [];

    dayIntervals.forEach((day, dayIndex) => {
      const { dateStamp, intervals } = day;

      const forecastIntervals: ForecastInterval[] = [];

      intervals.forEach((period, index) => {
        const code = Number(period.W);
        const weatherInfo = ForecastUtil.getWeatherStyle(code);
        const startTime = ForecastUtil.getStartTime(intervals.length, index);

        forecastIntervals.push({
          startTime,
          precip: period.Pp ?? "",
          temp: period.T,
          tempFeels: period.F ?? "",
          weatherInfo,
        });
      });

      const [dDate, dStartTime] = ForecastUtil.getDateTime(dateStamp);

      forecastDays.push({ date: dDate, startTime: dStartTime, intervals: forecastIntervals });
    });

    return forecastDays;
  }
}
