import { observer } from "mobx-react";
import React, { FC, useState } from "react";
import { SearchState } from "../state/SearchState";

import "./css/location.scss";
interface LocationProps {
  searchState: SearchState;
}

export const Location: FC<LocationProps> = observer(({ searchState }): JSX.Element => {
  const [showDetails, setShowDetails] = useState(false);

  const { locationState } = searchState;
  if (locationState?.name) {
    return (
      <div className='location'>
        <button className={`button toggle-button${showDetails ? " active" : ""}`} onClick={() => setShowDetails(!showDetails)}>
          +
        </button>
        <div className='basics'>
          <div>{locationState.area}</div>
          <div>Altitude: {locationState.elevation}m</div>
          <div>{locationState.coordinates}</div>
        </div>
        {showDetails && <div className='details'>User added details go here</div>}
      </div>
    );
  }
  return <></>;
});
