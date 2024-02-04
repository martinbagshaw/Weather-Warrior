/**
 * Weather
 *
 * Classes, interfaces, and enums relating to Met Office DataPoint weather API
 *
 * https://www.metoffice.gov.uk/services/data/datapoint/getting-started
 * https://www.metoffice.gov.uk/services/data/datapoint/api-reference
 *
 *
 */

// http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?${API_KEY}

export enum ForecastPeriod {
  ONE = 1,
  THREE = 3,
}

export interface SiteResponse {
  elevation: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  region: string;
  unitaryAuthArea: string;
}

export interface SiteResponseList {
  Locations: {
    Location: SiteResponse[];
  };
}

///////////
// This is the key. Presumably it changes, otherwise it would not be sent?

interface KeyCode {
  name: string;
  units: string;
  $: string;
}
interface WX {
  Param: KeyCode[];
}

// Example:
// Param: [
//   [0]     { name: 'F', units: 'C', '$': 'Feels Like Temperature' },
//   [0]     { name: 'G', units: 'mph', '$': 'Wind Gust' },
//   [0]     { name: 'H', units: '%', '$': 'Screen Relative Humidity' },
//   [0]     { name: 'T', units: 'C', '$': 'Temperature' },
//   [0]     { name: 'V', units: '', '$': 'Visibility' },
//   [0]     { name: 'D', units: 'compass', '$': 'Wind Direction' },
//   [0]     { name: 'S', units: 'mph', '$': 'Wind Speed' },
//   [0]     { name: 'U', units: '', '$': 'Max UV Index' },
//   [0]     { name: 'W', units: '', '$': 'Weather Type' },
//   [0]     { name: 'Pp', units: '%', '$': 'Precipitation Probability' }
//   [0]   ]

///////////
// This is the data

export enum KeyCodeName {
  F = "Feels Like Temperature",
  G = "Wind Gust",
}

interface Rep {
  D: string;
  F: string;
  G: string;
  H: string;
  Pp: string;
  S: string;
  T: string;
  V: string;
  W: string;
  U: string;
  $: string;
}
// {
// D: 'SSW',
// F: '6',
// G: '51',
// H: '99',
// Pp: '96',
// S: '27',
// T: '11',
// V: 'PO',
// W: '15',
// U: '0',
// '$': '1080'
// }
interface Period {
  type: string; //Day
  value: string; // date string / datestamp
  Rep: Rep[];
}
interface Location {
  i: string;
  lat: string;
  lon: string;
  name: string;
  country: string;
  continent: string;
  elevation: string;
  Period: Period[];
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
