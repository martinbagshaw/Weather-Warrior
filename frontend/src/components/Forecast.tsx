import { observer } from "mobx-react";
import React, { FC } from "react";
import { SearchState } from "../state/SearchState";

interface ForecastProps {
  searchState: SearchState;
}

export const Forecast: FC<ForecastProps> = observer(({ searchState }): JSX.Element => {
  if (searchState.forecastState) {
    return <div className='forecast'>{searchState.forecastState.name} forecast goes here...</div>;
  }
  return <></>;
});
