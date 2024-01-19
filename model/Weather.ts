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
  ONE,
  THREE,
}

export interface Site {
  elevation: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  region: string;
  unitaryAuthArea: string;
}

export interface SiteListResponse {
  Locations: {
    Location: Site[];
  };
}
