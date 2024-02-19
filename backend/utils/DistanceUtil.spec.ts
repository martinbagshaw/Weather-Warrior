import * as hourlySites from "../../test-data/hourly-sites.json";

import { DistanceUtil } from "./DistanceUtil";

describe("DistanceUtil", () => {
  const testSites = Object.values(hourlySites);

  const testIdMatch = {
    elevation: "15.0",
    id: "3002",
    latitude: "60.749",
    longitude: "-0.854",
    name: "Baltasound",
    region: "os",
    unitaryAuthArea: "Shetland Islands",
  };

  const testDistanceMatch = {
    elevation: "1344.0",
    id: "350377",
    latitude: "56.7965",
    longitude: "-5.0013",
    name: "Ben Nevis",
    region: "he",
    unitaryAuthArea: "Highland",
  };

  const expectedDistanceMatch = {
    elevation: "1130.0",
    id: "3041",
    latitude: "56.822",
    longitude: "-4.97",
    name: "Aonach Mor Summit",
    region: "he",
    unitaryAuthArea: "Highland",
  };

  const testDistanceMatch2 = {
    elevation: "21.0",
    id: "310046",
    latitude: "51.7345",
    longitude: "0.4778",
    name: "Chelmsford",
    region: "ee",
    unitaryAuthArea: "Essex",
  };

  const expectedDistanceMatch2 = {
    elevation: "87.0",
    id: "3684",
    latitude: "51.896",
    longitude: "0.453",
    name: "Andrewsfield",
    region: "ee",
    unitaryAuthArea: "Essex",
  };

  describe("getHourlySite", () => {
    test("gets hourly site by ID", () => {
      const idMatch = DistanceUtil.getHourlySite(testSites, testIdMatch);

      expect(idMatch).toEqual(testIdMatch);
    });

    test("gets hourly site by nearest latitude and longitude", () => {
      const distanceMatch = DistanceUtil.getHourlySite(testSites, testDistanceMatch);

      expect(distanceMatch).toEqual(expectedDistanceMatch);
    });

    test("gets hourly site by nearest name", () => {
      const distanceMatch = DistanceUtil.getHourlySite(testSites, testDistanceMatch2);

      expect(distanceMatch).toEqual(expectedDistanceMatch2);
    });
  });
});
