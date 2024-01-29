import { observer } from "mobx-react";
import React, { ChangeEvent, FC, FormEvent } from "react";
import { SearchState } from "../state/SearchState";
import { ForecastPeriod } from "../../../model/Weather";

interface SearchFormProps {
  searchState: SearchState;
}

export const SearchForm: FC<SearchFormProps> = observer(({ searchState }): JSX.Element => {
  const handleSubmit = (event: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    searchState.search();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    searchState.setQueryLocation(event.target.value);
  };

  return (
    <>
      <>
        <p className='warning-message'>{searchState.warningMessage}</p>
        <br />
      </>
      <form className='search-form' action='/search' method='get' onSubmit={(e) => handleSubmit(e)}>
        <fieldset className='search-bar'>
          <label htmlFor='location-search-input'>Location</label>
          <input id='location-search-input' type='text' onChange={(e) => handleInputChange(e)} />
          <button id='location-search-button' className='search-button' type='submit' onSubmit={(e) => handleSubmit(e)}>
            Search
          </button>
        </fieldset>
        <fieldset className='search-settings'>
          <label htmlFor='location-search-input'>Settings</label>
          <div className='forecast-period'>
            <input
              type='radio'
              id='hourly-forecast'
              value='Hourly forecast'
              checked={searchState.forecastPeriod === ForecastPeriod.ONE}
              onChange={() => searchState.setForecastPeriod(ForecastPeriod.ONE)}
            />
            <label htmlFor='hourly-forecast'>Hourly forecast (fewer locations available)</label>
            <input
              type='radio'
              id='three-hourly-forecast'
              value='Three hourly forecast'
              checked={searchState.forecastPeriod === ForecastPeriod.THREE}
              onChange={() => searchState.setForecastPeriod(ForecastPeriod.THREE)}
            />
            <label htmlFor='three-hourly-forecast'>Three hourly forecast (more locations available)</label>
          </div>
        </fieldset>
      </form>
    </>
  );
});
