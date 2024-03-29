/**
 * DataPointTypes
 *
 * Classes, interfaces, and enums relating to Met Office DataPoint weather API
 *
 * https://www.metoffice.gov.uk/services/data/datapoint/getting-started
 * https://www.metoffice.gov.uk/services/data/datapoint/api-reference
 *
 */

// export enum Region {
//   SE = "se",
//   EE = "ee",
//   NI = "ni",
//   NW = "nw",
//   YH = "yh",
//   OS = "os",
//   NE = "ne",
//   TA = "ta",
//   HE = "he",
//   GR = "gr",
//   ST = "st",
//   DG = "dg",
//   WL = "wl",
//   WM = "wm",
//   EM = "em",
//   SW = "sw",
// }

// Forecast units:
// { name: 'F', units: 'C', '$': 'Feels Like Temperature' },
// { name: 'G', units: 'mph', '$': 'Wind Gust' },
// { name: 'H', units: '%', '$': 'Screen Relative Humidity' },
// { name: 'T', units: 'C', '$': 'Temperature' },
// { name: 'V', units: '', '$': 'Visibility' },
// { name: 'D', units: 'compass', '$': 'Wind Direction' },
// { name: 'S', units: 'mph', '$': 'Wind Speed' },
// { name: 'U', units: '', '$': 'Max UV Index' },
// { name: 'W', units: '', '$': 'Weather Type' },
// { name: 'Pp', units: '%', '$': 'Precipitation Probability' }
//

// Observation units:
// { name: 'G', units: 'mph', '$': 'Wind Gust' },
// { name: 'T', units: 'C', '$': 'Temperature' },
// { name: 'V', units: 'm', '$': 'Visibility' },
// { name: 'D', units: 'compass', '$': 'Wind Direction' },
// { name: 'S', units: 'mph', '$': 'Wind Speed' },
// { name: 'W', units: '', '$': 'Weather Type' },
// { name: 'P', units: 'hpa', '$': 'Pressure' },
// { name: 'Pt', units: 'Pa/s', '$': 'Pressure Tendency' },
// { name: 'Dp', units: 'C', '$': 'Dew Point' },
// { name: 'H', units: '%', '$': 'Screen Relative Humidity' }

// ends with 'O' = observation
// ends with 'F' = forecast
export enum WeatherUnits {
  DEW_POINT_O = "Dp",
  FEELS_LIKE_TEMPERATURE_F = "F",
  MAX_UV_INDEX_F = "U",
  PRECIPITATION_PROBABILITY_F = "Pp",
  PRESSURE_O = "P",
  PRESSURE_TENDENCY_O = "Pt",
  WIND_DIRECTION = "D",
  WIND_GUST = "G",
  WIND_SPEED = "S",
}
/*
hourly:
    Dp
    P
    Pt

    three hourly:
    F
    U
    
    */
export interface Site {
  elevation: string;
  id: string;
  latitude: string;
  longitude: string;
  name?: string;
  region?: string; //Region;
  unitaryAuthArea?: string;
  obsSource?: string;
  nationalPark?: string;
}

export interface SiteList {
  Locations: {
    Location: Site[];
  };
}

export interface Rep {
  D: string;
  G: string;
  H: string;
  S: string;
  T: string;
  V: string;
  W: string;
  Dp?: string;
  F?: string;
  U?: string;
  P?: string;
  Pp?: string;
  Pt?: string;
  $: string;
}

export interface Period {
  type: string; //Day
  value: string; // date string / datestamp
  Rep: Rep | Rep[];
}

export interface DV {
  dataDate: string;
  type: string;
  Location: Location; // A single location (in theory)
}

export interface ForecastResponse {
  SiteRep: {
    Wx: WX;
    DV: DV;
  };
}

interface Location {
  i: string;
  lat: string;
  lon: string;
  name: string;
  country: string;
  continent: string;
  elevation: string;
  Period: Period | Period[];
}

interface KeyCode {
  name: string;
  units: string;
  $: string;
}

interface WX {
  Param: KeyCode[];
}
