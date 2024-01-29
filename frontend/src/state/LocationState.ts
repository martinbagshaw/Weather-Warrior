import { makeObservable, action, observable } from "mobx";

import { SiteResponse } from "../../../model/Weather";
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

  constructor(
    private readonly locationData: SiteResponse,
    public readonly country: string
  ) {
    this.init(this.locationData);
    makeObservable(this);
  }

  private init(locationData: SiteResponse) {
    const { elevation, id, latitude, longitude, name, region, unitaryAuthArea } = locationData;

    this.id = id;

    this.setName(name);
    this.setArea(region, unitaryAuthArea);
    this.setElevation(elevation);
    this.setCoordinates(latitude, longitude);
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

    this.area = `${area}, ${regionText ?? region}, ${this.country}`;
  }

  @action public setCoordinates(x: number, y: number) {
    const coordinates = `${x}, ${y}`;
    this.coordinates = coordinates;
  }
}
