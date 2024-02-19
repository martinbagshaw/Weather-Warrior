import { makeObservable, action, observable } from "mobx";

import { LocationForecast } from "../../../model/WeatherTypes";
import { EnumUtil } from "../../../utils/EnumUtil";

enum Regions {
  // South
  sw = "South West",
  se = "South East",
  ee = "East Anglia",
  // Mid
  wm = "West Midlands",
  em = "East Midlands",
  // North
  nw = "North West",
  ne = "North West",
  // Wales
  wl = "Wales",
  // Ireland
  ni = "Northern Ireland",
  // Scotland,
  dg = "South and Central", // Dumfries and Galloway
  st = "Central and Southern Higlands", //Stirling
  ta = "East and Central", //Tayside
  gr = "Eastern Highlands", //Grampian
  he = "Highland", // Eastern Highlands?
}

export class LocationState {
  @observable public name = "";
  @observable public area = "";
  @observable public elevation = 0;
  @observable public coordinates = "";

  private id = 0;

  constructor(private readonly locationForecast: LocationForecast) {
    this.init(this.locationForecast);
    makeObservable(this);
  }

  private init(locationForecast: LocationForecast) {
    const { site, locationDetails } = locationForecast;
    // const { elevation, id, latitude, longitude, name, region, unitaryAuthArea } = locationForecast;

    this.id = Number(site?.id ?? 0);

    if (locationDetails) {
      this.setName(locationDetails.name);
    }

    if (site) {
      const { region, unitaryAuthArea } = site;
      if (region && unitaryAuthArea) {
        this.setArea(region, unitaryAuthArea);
      }
    }

    if (locationDetails?.elevation) {
      this.setElevation(locationDetails.elevation);
    }

    if (locationDetails?.latitude && locationDetails?.longitude) {
      const { latitude, longitude } = locationDetails;
      this.setCoordinates(latitude, longitude);
    }
  }

  @action public setName(name: string) {
    this.name = name;
  }

  @action public setElevation(elevation: number) {
    this.elevation = elevation;
  }

  @action public setArea(region: string, area: string) {
    /* convert two letter region into an area */
    const regionText = EnumUtil.getEnumValueByKey(Regions, region);

    this.area = `${area}, ${regionText ?? region}, ${this.locationForecast.locationDetails?.country}`;
  }

  @action public setCoordinates(x: number, y: number) {
    const coordinates = `${x}, ${y}`;
    this.coordinates = coordinates;
  }
}
