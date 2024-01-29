import { observer } from "mobx-react";
import React, { FC } from "react";
import { SearchState } from "../state/SearchState";

interface ForecastProps {
  searchState: SearchState;
}

export const Forecast: FC<ForecastProps> = observer(({ searchState }): JSX.Element => {
  const { forecastState } = searchState;
  if (forecastState) {
    return <div className='forecast'>forecast to go here...</div>;
  }
  return <></>;
});
