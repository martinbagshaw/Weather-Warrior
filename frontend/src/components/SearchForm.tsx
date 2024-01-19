import React, { FC } from "react";

export const SearchForm: FC = (): JSX.Element => (
  <form className='search-bar' action='/search' method='get'>
    <label htmlFor='location-search-input'>Location</label>
    <input id='location-search-input' type='text' />
    <button id='location-search-button' className='search-button' type='submit'>
      Search
    </button>
  </form>
);
