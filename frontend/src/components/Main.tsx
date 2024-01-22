import React, { FC } from "react";
import { RootState } from "../state/RootState";

import { SearchForm } from "./SearchForm";
import { Forecast } from "./Forecast";

interface MainProps {
  rootState: RootState;
}

export const Main: FC<MainProps> = ({ rootState }): JSX.Element => (
  <main>
    <div className='container'>
      <SearchForm searchState={rootState.searchState} />
      <Forecast searchState={rootState.searchState} />
    </div>
  </main>
);
