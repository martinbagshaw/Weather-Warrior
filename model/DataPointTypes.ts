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
