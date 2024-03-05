import { Rep, WeatherUnits } from "../model/DataPointTypes";
import { DayInterval, LocationForecast } from "../model/WeatherTypes";
import { ForecastDay, ForecastInterval, WeatherStyle } from "../model/WeatherUITypes";

/**
 * ForecastUtil
 *
 * Translates Met Office DataPoint weather forecast
 * https://www.metoffice.gov.uk/services/data/datapoint/code-definitions
 *
 * */

export class ForecastUtil {
  public static getDateTime(date = ""): [string, string] {
    const bits = date.split(/[\T\Z,]+/).filter((i) => !!i);
    if (!bits.length || bits.length > 2) {
      return ["", ""];
    }

    const isDate = bits.length === 1;
    const rawDate = isDate ? bits[0] : date;
    const dateObject = new Date(rawDate);

    const words = dateObject.toString().split(" ");
    const dayText = `${words[0]} ${words[2]} ${words[1]}`;
    const timeText = dateObject.getHours().toString();

    return [dayText, timeText];
  }

  /**
   * Shows as many hourly observations as possible, followed by three hourly forecasts
   * - applies correct time to each interval (from observation or forecast)
   *
   * TODO: simplify (somehow...)
   */
  public static mergeObservationForecastDays2(
    hourlyObservations: DayInterval[],
    threeHourlyForecasts: DayInterval[]
  ): ForecastDay[] {
    const allDates = Array.from(
      new Set([
        ...hourlyObservations.map((o) => o.dateStamp),
        ...threeHourlyForecasts.map((f) => f.dateStamp),
      ])
    );

    const intervalMap = new Map<string, DayInterval[]>();
    allDates.forEach((date) => {
      // const existingInterval = intervalMap.has(date);
      const hourlyDate = hourlyObservations.find((d) => d.dateStamp === date);
      const threeHourlyDate = threeHourlyForecasts.find((d) => d.dateStamp === date);

      if (hourlyDate && !intervalMap.has(date)) {
        intervalMap.set(date, [hourlyDate]);
      }

      if (threeHourlyDate && !intervalMap.has(date)) {
        intervalMap.set(date, [threeHourlyDate]);
      }

      if (hourlyDate && threeHourlyDate && intervalMap.has(date)) {
        const hourlyInterval = intervalMap.get(date);
        if (hourlyInterval) {
          intervalMap.set(date, [...hourlyInterval, threeHourlyDate]);
        }
      }
    });

    const forecastDays: ForecastDay[] = [];

    Array.from(intervalMap).forEach(([_date, dayIntervals], index) => {
      // Observaton
      if (index === 0) {
        const forecastDay = ForecastUtil.getForecastDay(dayIntervals[0], true);
        forecastDays.push(forecastDay);
      }
      // Merged
      if (index === 1) {
        const observationCount = dayIntervals[0].intervals.length;
        let dayInterval: DayInterval | undefined = undefined;
        let isObservation = false;

        // All observations or days
        if (observationCount === 24 || observationCount === 1) {
          isObservation = observationCount === 24;
          dayInterval = observationCount === 24 ? dayIntervals[0] : dayIntervals[1];

          if (dayInterval) {
            const forecastDay = ForecastUtil.getForecastDay(dayInterval, isObservation);
            forecastDays.push(forecastDay);
          }
        } else {
          // Merged
          const [date, startTime] = ForecastUtil.getDateTime(dayIntervals[1].dateStamp);

          const observationIntervals = ForecastUtil.getDailyIntervals(
            dayIntervals[0].intervals,
            true,
            true
          );

          const last = Number(observationIntervals[observationIntervals.length - 1].startTime);
          const forecastIntervals = ForecastUtil.getDailyIntervals(
            dayIntervals[1].intervals,
            false,
            true,
            last
          ).filter((fi) => fi.startTime);

          const intervals = [...observationIntervals, ...forecastIntervals];
          const forecastDay = { date, startTime, intervals };
          forecastDays.push(forecastDay);
        }
      }

      // Forecast
      if (index > 1) {
        const forecastDay = ForecastUtil.getForecastDay(dayIntervals[0]);
        forecastDays.push(forecastDay);
      }
    });

    return forecastDays;
  }

  private static getForecastDay(dayInterval: DayInterval, isObservation = false): ForecastDay {
    const { dateStamp, intervals } = dayInterval;

    const [date, startTime] = ForecastUtil.getDateTime(dateStamp);
    const forecastIntervals = ForecastUtil.getDailyIntervals(intervals, isObservation);
    return { date, startTime, intervals: forecastIntervals };
  }

  private static getDailyIntervals(
    intervals: Rep[],
    isObservation = false,
    startTimeOveride = false,
    startValue?: number
  ) {
    const forecastIntervals: ForecastInterval[] = [];

    intervals.forEach((period, index) => {
      const code = Number(period.W);
      const weatherInfo = ForecastUtil.getWeatherStyle(code);
      let startTime = ForecastUtil.getStartTime(intervals.length, index, isObservation);

      // TODO: cut down on this logic / simplify or refactor
      if (startTimeOveride && isObservation) {
        startTime = index.toString().padStart(2, "0");
      }

      if (startTimeOveride && !isObservation && startValue) {
        const arr = [0, 3, 6, 9, 12, 15, 18, 21];
        const startIndex = arr.findIndex((i) => i > startValue);
        const aggIndex = startIndex + index;
        if (startIndex > -1 && aggIndex < arr.length) {
          startTime = arr[aggIndex].toString().padStart(2, "0");
        } else {
          startTime = "";
        }
      }
      /////////////////////////////

      forecastIntervals.push({
        startTime,
        precip: period.Pp ?? "",
        temp: period.T,
        tempFeels: period.F ?? "",
        weatherInfo,
      });
    });

    return forecastIntervals;
  }

  // TODO: May require change, see forecast state
  public static getStartTime = (intervalCount: number, index: number, isObservation = false) => {
    // isObservation = hourly, !isObservation = three hourly
    const dailyIntervals = isObservation ? 24 : 8;
    const intervalDuration = isObservation ? 1 : 3;
    const remaining = dailyIntervals - intervalCount;
    const hourNumber = (index + remaining) * intervalDuration;
    return hourNumber.toString().padStart(2, "0");
  };

  /*
  untested:
  4, 5, 11, 13, 14
  25, 26, 27
  
  */
  public static getWeatherStyle(weatherCode: number): WeatherStyle | undefined {
    const weather: WeatherStyle = {
      code: weatherCode,
      description: "",
      iconClass: "not-used",
    };

    switch (weatherCode) {
      case -1: {
        weather.description = "Trace rain";
        weather.iconClass = "trace-rain";
        return weather;
      }
      // TESTED:
      case 0: {
        weather.description = "Clear night";
        weather.iconClass = "moon";
        return weather;
      }
      // TESTED:
      case 1: {
        weather.description = "Sunny day";
        weather.iconClass = "sun";
        return weather;
      }
      // TESTED:
      case 2: {
        weather.description = "Partly cloudy (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud";
        return weather;
      }
      // TESTED:
      case 3: {
        weather.description = "Partly cloudy (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud";
        return weather;
      }
      case 4: {
        weather.description = "Not used";
        return weather;
      }
      // TESTED:
      case 5: {
        weather.description = "Mist";
        weather.iconClass = "cloud";
        weather.underIconClass = "mist";
        return weather;
      }
      // TESTED:
      case 6: {
        weather.description = "Fog";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "fog";
        return weather;
      }
      // TESTED:
      case 7: {
        weather.description = "Cloudy";
        weather.iconClass = "cloud";
        return weather;
      }
      // TESTED:
      case 8: {
        weather.description = "Overcast";
        weather.iconClass = "cloud light-grey";
        return weather;
      }
      case 9: {
        // TESTED:
        weather.description = "Light rain shower (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud";
        weather.underIconClass = "light-rain";
        return weather;
      }
      // TESTED:
      case 10: {
        weather.description = "Light rain shower (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud";
        weather.underIconClass = "light-rain";
        return weather;
      }
      case 11: {
        weather.description = "Drizzle";
        weather.iconClass = "drizzle";
        return weather;
      }
      // TESTED:
      case 12: {
        weather.description = "Light rain";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "light-rain";
        return weather;
      }
      case 13: {
        weather.description = "Heavy rain shower (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud grey";
        weather.underIconClass = "heavy-rain";
        return weather;
      }
      case 14: {
        weather.description = "Heavy rain shower (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud grey";
        weather.underIconClass = "heavy-rain";
        return weather;
      }
      // TESTED:
      case 15: {
        weather.description = "Heavy rain";
        weather.iconClass = "cloud grey";
        weather.underIconClass = "heavy-rain";
        return weather;
      }
      // TESTED:
      case 16: {
        weather.description = "Sleet shower (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud";
        weather.underIconClass = "sleet";
        return weather;
      }
      // TESTED:
      case 17: {
        weather.description = "Sleet shower (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud";
        weather.underIconClass = "sleet";
        return weather;
      }
      // TESTED:
      case 18: {
        weather.description = "Sleet";
        weather.iconClass = "cloud grey";
        weather.underIconClass = "sleet";
        return weather;
      }
      // case 19:
      //   return "Hail shower (night)";
      // case 20:
      //   return "Hail shower (day)";
      // case 21:
      //   return "Hail";
      // TESTED:
      case 22: {
        weather.description = "Light snow shower (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud";
        weather.underIconClass = "snow";
        return weather;
      }
      // TESTED:
      case 23: {
        weather.description = "Light snow shower (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud";
        weather.underIconClass = "snow";
        return weather;
      }
      // TESTED:
      case 24: {
        weather.description = "Light snow";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "snow";
        return weather;
      }
      case 25: {
        weather.description = "Heavy snow shower (night)";
        weather.aboveIconClass = "moon";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "heavy-snow";
        return weather;
      }
      case 26: {
        weather.description = "Heavy snow shower (day)";
        weather.aboveIconClass = "sun";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "heavy-snow";
        return weather;
      }
      case 27: {
        weather.description = "Heavy snow";
        weather.iconClass = "cloud light-grey";
        weather.underIconClass = "heavy-snow";
        return weather;
      }
      // case 28:
      //   return "Thunder shower (night)";
      // case 29:
      //   return "Thunder shower (day)";
      // case 30:
      //   return "Thunder";
    }

    return;
  }
}
