import { Site } from "../../model/DataPointTypes";

/**
 * SiteUtil
 * 
 * Aims to match searched location to a site for 3 hourly forecast, and closest 1 hour observation
 * 
 * 1. Observation sites (150 or so total, hourly forecasts)
 * 
 * 1 degree = 69 miles
 * Default: accurate within 0.5 degrees, so 35 miles ~ 50km
 * TODO: make this a user setting
 * 
 * 2. Forecast sites (6000 or so total)
 * Make this more accurate
 * 
/*

This example is 3h and 1h:
- but who is going to search for 'Baltasound'?
- therefore perhaps include unitaryAuthArea in 3h initial search

1 degree = 69 miles
maybe make default accurate within 0.5 degrees, so 35 miles ~ 50km

{
  elevation: "15.0"
  id: "3002"
  latitude: "60.749"
  longitude: "-0.854"
  name: "Baltasound"
  region: "os"
  unitaryAuthArea: "Shetland Islands"
}

-------------

also: national parks and mountain
txt/wxfcs/nationalpark/datatype/sitelist
txt/wxfcs/mountainarea/datatype/sitelist


*/

export class DistanceUtil {
  // Site location matcher
  private static degreesAccuracy = 0.5;
  private static multiplier = 1000;

  public static getHourlySite(hourlySites: Site[], threeHourlySite?: Site): Site | undefined {
    if (!threeHourlySite) {
      return;
    }

    const proximityMatches: Site[] = [];

    for (const site of hourlySites) {
      if (site.id === threeHourlySite.id) {
        return site;
      }

      const match = DistanceUtil.proximityMatch(site, threeHourlySite);
      if (match) {
        proximityMatches.push(match);
      }
    }

    if (proximityMatches.length) {
      return DistanceUtil.returnProximityMatch(proximityMatches, threeHourlySite);
    }
  }

  private static returnProximityMatch(proximityMatches: Site[], threeHourlySite: Site): Site | undefined {
    const { latitude, longitude } = threeHourlySite;

    const sorted = proximityMatches.sort(
      (a, b) =>
        DistanceUtil.relativeDistance(a.latitude, a.longitude, latitude, longitude) -
        DistanceUtil.relativeDistance(b.latitude, b.longitude, latitude, longitude)
    );
    return sorted[0];
  }

  private static hav(x: number) {
    const s = Math.sin(x / 2);
    return s * s;
  }

  private static relativeDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
    const PI_180 = Math.PI / 180;

    const aLatRad = Number(lat1) * PI_180;
    const bLatRad = Number(lat2) * PI_180;
    const aLngRad = Number(lon1) * PI_180;
    const bLngRad = Number(lon2) * PI_180;

    const latitude = DistanceUtil.hav(bLatRad - aLatRad) + Math.cos(aLatRad) * Math.cos(bLatRad);
    const longitude = DistanceUtil.hav(bLngRad - aLngRad);

    return Math.asin(latitude * longitude);
  }

  private static proximityMatch(siteA: Site, siteB: Site) {
    const xInRange = DistanceUtil.proximityRangeMatch(siteA.latitude, siteB.latitude);
    const yInRange = DistanceUtil.proximityRangeMatch(siteA.longitude, siteB.longitude);

    return xInRange && yInRange ? siteA : undefined;
  }

  private static proximityRangeMatch(a: string, b: string): boolean {
    // * 1000 to prevent rounding errors of floating point numbers
    const h1 = Number(a) * DistanceUtil.multiplier;
    const h3 = Number(b) * DistanceUtil.multiplier;

    // If out by more than half a degree (roughly 35 miles or 50km)
    // TODO: have this as a user setting
    const tolerance = DistanceUtil.degreesAccuracy * DistanceUtil.multiplier;
    if (h1 - h3 >= -tolerance && h1 - h3 <= tolerance) {
      return true;
    }
    return false;
  }

  public static getThreeHourlySite(searchedLocation: string, sites: Site[]): Site | undefined {
    const exactMatch = sites.find((s) => s.name?.toLowerCase() === searchedLocation);

    if (exactMatch) {
      return exactMatch;
    }

    // TODO: use region, unitaryAuthArea etc to narrow down matches
    // can't use latitude and longitude, as we do not have them
    // - perhaps put this in site util, as we cannot use distance to narrow down matches here

    const includedMatches = sites.filter((s) => s.name?.toLowerCase().includes(searchedLocation));

    if (includedMatches.length === 1) {
      console.log("near match: ", includedMatches[0]);
      return includedMatches[0];
    }
  }
}
