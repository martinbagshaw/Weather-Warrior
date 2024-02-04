import { observer } from "mobx-react";
import React, { FC, useState } from "react";

import { SearchState } from "../state/SearchState";
import { DailyForecast } from "./DailyForecast";

import "./css/forecast.scss";
interface ForecastProps {
  searchState: SearchState;
}

export const Forecast: FC<ForecastProps> = observer(({ searchState }): JSX.Element => {
  const [activeDay, setActiveDay] = useState(0);

  const { forecastState } = searchState;

  if (!forecastState?.forecast) {
    return <></>;
  }

  const { date, startTime, days } = forecastState.forecast;

  return (
    <div className='forecast'>
      {date}, {startTime}:00 hours
      <div className='forecast-days'>
        {days.map(({ date }, index) => (
          <div key={date} className={`forecast-day${activeDay === index ? " active" : ""}`} onClick={() => setActiveDay(index)}>
            {date}
            {/* Get midday or most common daily temperatures from analysing intervals */}
          </div>
        ))}
      </div>
      <DailyForecast intervals={days[activeDay].intervals} />
    </div>
  );
});
