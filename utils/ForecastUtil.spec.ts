import { dayForecasts as firstObservationData } from "../test-data/observation/observation-sample.json";
import { dayForecasts as secondObservationData } from "../test-data/observation/observation-sample-2.json";
import { dayForecasts as thirdObservationData } from "../test-data/observation/observation-sample-3.json";
import { dayForecasts as fourthObservationData } from "../test-data/observation/observation-sample-4.json";

import { dayForecasts as firstForecastData } from "../test-data/forecast/forecast-sample.json";
import { dayForecasts as secondForecastData } from "../test-data/forecast/forecast-sample-2.json";
import { dayForecasts as thirdForecastData } from "../test-data/forecast/forecast-sample-3.json";
import { dayForecasts as fourthForecastData } from "../test-data/forecast/forecast-sample-4.json";

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

  describe("mergeObservationForecastDays", () => {
    test("Early morning forecast (1st sample): 5 days. 1st day observations, final 4 days forecasts", () => {
      const mergedDays = ForecastUtil.mergeObservationForecastDays2(
        firstObservationData,
        firstForecastData
      );

      const mergedDates = mergedDays.map((md) => md.date);

      expect(mergedDates).toEqual([
        "Fri 23 Feb",
        "Sat 24 Feb",
        "Sun 25 Feb",
        "Mon 26 Feb",
        "Tue 27 Feb",
      ]);

      // 1
      const allObservationsDay = mergedDays[0];
      expect(allObservationsDay.intervals.length).toBe(24);
      expect(allObservationsDay.date).toBe("Fri 23 Feb");
      expect(allObservationsDay.startTime).toBe("0");

      expect(allObservationsDay.intervals[0].startTime).toBe("00");
      expect(allObservationsDay.intervals[1].startTime).toBe("01");
      expect(allObservationsDay.intervals[2].startTime).toBe("02");
      expect(allObservationsDay.intervals[3].startTime).toBe("03");
      expect(allObservationsDay.intervals[4].startTime).toBe("04");
      expect(allObservationsDay.intervals[5].startTime).toBe("05");

      // 2
      const observationForecastDay = mergedDays[1];
      expect(observationForecastDay.intervals.length).toBe(8);
      expect(observationForecastDay.date).toBe("Sat 24 Feb");
      expect(observationForecastDay.startTime).toBe("0");

      expect(observationForecastDay.intervals[0].startTime).toBe("00");
      expect(observationForecastDay.intervals[1].startTime).toBe("03");
      expect(observationForecastDay.intervals[2].startTime).toBe("06");
      expect(observationForecastDay.intervals[3].startTime).toBe("09");
      expect(observationForecastDay.intervals[4].startTime).toBe("12");
      expect(observationForecastDay.intervals[5].startTime).toBe("15");

      // 3
      const firstObservationDay = mergedDays[2];
      expect(firstObservationDay.date).toBe("Sun 25 Feb");
    });

    test("Mid morning forecast (4th sample): 6 days. 9 x hourly intervals, 7 x 3 hourly intervals on merged day", () => {
      const mergedDays = ForecastUtil.mergeObservationForecastDays2(
        fourthObservationData,
        fourthForecastData
      );

      const mergedDates = mergedDays.map((md) => md.date);

      expect(mergedDates).toEqual([
        "Sun 03 Mar",
        "Mon 04 Mar",
        "Tue 05 Mar",
        "Wed 06 Mar",
        "Thu 07 Mar",
        "Fri 08 Mar",
      ]);

      const allObservationsDay = mergedDays[0];
      expect(allObservationsDay.date).toBe("Sun 03 Mar");
      expect(allObservationsDay.startTime).toBe("0");
      expect(allObservationsDay.intervals[0].startTime).toBe("08");

      const observationForecastDay = mergedDays[1];
      expect(observationForecastDay.date).toBe("Mon 04 Mar");
      expect(observationForecastDay.startTime).toBe("0");

      const mergedStartTimes = observationForecastDay.intervals.map((i) => i.startTime);

      expect(mergedStartTimes).toEqual([
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "12",
        "15",
        "18",
        "21",
      ]);
    });

    test("Late evening forecast (2nd sample): 6 days. 1st 2 days observations, final 4 days forecasts", () => {
      const mergedDays = ForecastUtil.mergeObservationForecastDays2(
        secondObservationData,
        secondForecastData
      );

      const mergedDates = mergedDays.map((md) => md.date);

      expect(mergedDates).toEqual([
        "Fri 23 Feb",
        "Sat 24 Feb",
        "Sun 25 Feb",
        "Mon 26 Feb",
        "Tue 27 Feb",
        "Wed 28 Feb",
      ]);

      // 1
      const allObservationsDay = mergedDays[0];
      expect(allObservationsDay.intervals.length).toBe(1);
      expect(allObservationsDay.date).toBe("Fri 23 Feb");
      expect(allObservationsDay.startTime).toBe("0");

      expect(allObservationsDay.intervals[0].startTime).toBe("23");

      // 2
      const observationForecastDay = mergedDays[1];
      expect(observationForecastDay.intervals.length).toBe(24);
      expect(observationForecastDay.date).toBe("Sat 24 Feb");
      expect(observationForecastDay.startTime).toBe("0");

      const mergedStartTimes = observationForecastDay.intervals.map((i) => i.startTime);

      expect(mergedStartTimes).toEqual([
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ]);

      // 3
      const firstObservationDay = mergedDays[2];
      expect(firstObservationDay.date).toBe("Sun 25 Feb");
      expect(firstObservationDay.intervals[0].startTime).toBe("00");
    });

    test("Early evening forecast (3rd sample): 6 days. 20 x 1h intervals, 1 x hourly interval on the merged day", () => {
      const mergedDays = ForecastUtil.mergeObservationForecastDays2(
        thirdObservationData,
        thirdForecastData
      );

      const mergedDates = mergedDays.map((md) => md.date);

      expect(mergedDates).toEqual([
        "Sat 24 Feb",
        "Sun 25 Feb",
        "Mon 26 Feb",
        "Tue 27 Feb",
        "Wed 28 Feb",
        "Thu 29 Feb",
      ]);

      // 1
      const allObservationsDay = mergedDays[0];
      expect(allObservationsDay.intervals.length).toBe(5);
      expect(allObservationsDay.date).toBe("Sat 24 Feb");
      expect(allObservationsDay.startTime).toBe("0");

      expect(allObservationsDay.intervals[0].startTime).toBe("19");

      // 2
      const observationForecastDay = mergedDays[1];
      expect(observationForecastDay.date).toBe("Sun 25 Feb");
      expect(observationForecastDay.startTime).toBe("0");

      const startTimes = observationForecastDay.intervals.map((i) => i.startTime);

      expect(startTimes).toEqual([
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "21",
      ]);

      // 3
      const firstObservationDay = mergedDays[2];
      expect(firstObservationDay.date).toBe("Mon 26 Feb");
      expect(firstObservationDay.intervals[0].startTime).toBe("00");
    });
  });

  describe("getStartTime", () => {});

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
