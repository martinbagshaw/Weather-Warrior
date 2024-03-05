import { observer } from "mobx-react";
import React, { FC } from "react";

import { ForecastInterval, WeatherStyle } from "../../../model/WeatherUITypes";

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

    const { aboveIconClass, description, iconClass, underIconClass } = weatherInfo;

    return (
      <div className={`weather-icon ${iconClass}`}>
        {aboveIconClass && <div className={`weather-icon-above ${aboveIconClass}`} />}
        <span className='weather-description'>{description}</span>
        {underIconClass && <div className={`weather-icon-under ${underIconClass}`} />}
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
          {tempFeels && <div>{tempFeels} C</div>}
          {getWeatherIcon(weatherInfo)}
        </div>
      ))}
    </div>
  );
});
