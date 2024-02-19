import { observer } from "mobx-react";
import React, { FC } from "react";

import { ForecastInterval } from "../state/ForecastState";
import { WeatherStyle } from "../../../utils/ForecastUtil";

import "./css/weather-icons.scss";

export interface DailyForecastProps {
  intervals: ForecastInterval[];
  isObservation: boolean;
}

export const DailyForecast: FC<DailyForecastProps> = observer(({ intervals, isObservation }): JSX.Element => {
  const getWeatherIcon = (weatherInfo?: WeatherStyle) => {
    if (!weatherInfo) {
      return;
    }

    return (
      <div className={`weather-icon ${weatherInfo.iconClass}`}>
        {weatherInfo.aboveIconClass && <div className={`weather-icon-above ${weatherInfo.aboveIconClass}`} />}
        <span className='weather-description'>{weatherInfo.description}</span>
        {weatherInfo.underIconClass && <div className={`weather-icon-under ${weatherInfo.underIconClass}`} />}
      </div>
    );
  };

  const getPrecipStyle = (precip: string) => {
    if (Number(precip) >= 25) {
      return "precipitation-likely";
    }
    return "";
  };

  return (
    <div className={`forecast-intervals${isObservation ? " observation" : ""}`}>
      {intervals.map(({ startTime, precip, temp, tempFeels, weatherInfo }, index) => (
        <div key={index} className='forecast-interval'>
          <div>
            <div className='interval-time'>{startTime}:00</div>
          </div>
          <div className={getPrecipStyle(precip)}>{precip}%</div>
          <div>{temp} C</div>
          <div>{tempFeels} C</div>
          {getWeatherIcon(weatherInfo)}
        </div>
      ))}
    </div>
  );
});
