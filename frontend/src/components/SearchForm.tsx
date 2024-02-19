import { observer } from "mobx-react";
import React, { ChangeEvent, FC, FormEvent } from "react";

import { SearchState } from "../state/SearchState";
import { ForecastPeriod } from "../../../model/WeatherTypes";

import "./css/form-components.scss";
import "./css/search-form.scss";

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
          <button id='location-search-button' className='search-button button' type='submit' onSubmit={(e) => handleSubmit(e)}>
            Search
          </button>
        </fieldset>
      </form>
    </>
  );
});
