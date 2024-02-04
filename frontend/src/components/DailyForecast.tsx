import { observer } from "mobx-react";
import React, { FC } from "react";

import { ForecastInterval } from "../state/ForecastState";
import { WeatherStyle } from "../../../utils/ForecastUtil";

import "./css/weather-icons.scss";

export interface DailyForecastProps {
  intervals: ForecastInterval[];
}

export const DailyForecast: FC<DailyForecastProps> = observer(({ intervals }): JSX.Element => {
  const getTime = (intervalCount: number, index: number) => {
    const remaining = 8 - intervalCount;
    const hourNumber = (index + remaining) * 3;
    const hours = hourNumber.toString().padStart(2, "0");

    return <div className='interval-time'>{hours}:00</div>;
  };

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
    <div className='forecast-intervals'>
      {intervals.map(({ precip, temp, tempFeels, weatherInfo }, index) => (
        <div key={index} className='forecast-interval'>
          <div>{getTime(intervals.length, index)}</div>
          <div className={getPrecipStyle(precip)}>{precip}%</div>
          <div>{temp} C</div>
          <div>{tempFeels} C</div>
          {getWeatherIcon(weatherInfo)}
        </div>
      ))}
    </div>
  );
});
