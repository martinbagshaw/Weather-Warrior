/**
 * ForecastUtil
 *
 * Translates Met Office DataPoint weather forecast
 * https://www.metoffice.gov.uk/services/data/datapoint/code-definitions
 *
 * */

export interface WeatherStyle {
  code: number;
  description: string;
  iconClass: string;
  aboveIconClass?: string;
  underIconClass?: string;
}

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
