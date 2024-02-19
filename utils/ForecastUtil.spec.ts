import { ForecastUtil } from "./ForecastUtil";

describe("ForecastUtil", () => {
  describe("getDateTime", () => {
    test("returns an empty two part array", () => {
      const dateTime = ForecastUtil.getDateTime();
      expect(dateTime).toEqual(["", ""]);
    });

    test("returns date only", () => {
      const dateTime = ForecastUtil.getDateTime("2024-02-22Z");
      expect(dateTime).toEqual(["Thu 22 Feb", "0"]);
    });

    test("returns date and start time in hours", () => {
      const dateTime = ForecastUtil.getDateTime("2024-02-19T21:00:00Z");
      expect(dateTime).toEqual(["Mon 19 Feb", "21"]);
    });
  });

  // describe("getStartTime", () => {});

  describe("getWeatherStyle", () => {
    test("returns style for: Clear night", () => {
      const clearNight = ForecastUtil.getWeatherStyle(0);
      expect(clearNight?.description).toBe("Clear night");
      expect(clearNight?.iconClass).toBe("moon");
    });

    test("returns style for: Light rain", () => {
      const heavyRainNight = ForecastUtil.getWeatherStyle(12);
      expect(heavyRainNight?.description).toBe("Light rain");
      expect(heavyRainNight?.iconClass).toBe("cloud light-grey");
      expect(heavyRainNight?.underIconClass).toBe("light-rain");
    });

    test("returns style for: Heavy rain shower (night)", () => {
      const heavyRainNight = ForecastUtil.getWeatherStyle(13);
      expect(heavyRainNight?.description).toBe("Heavy rain shower (night)");
      expect(heavyRainNight?.aboveIconClass).toBe("moon");
      expect(heavyRainNight?.iconClass).toBe("cloud grey");
      expect(heavyRainNight?.underIconClass).toBe("heavy-rain");
    });
  });
});
