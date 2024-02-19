import { SiteUtil } from "./SiteUtil";

describe("SiteUtil", () => {
  describe("getSiteCountry", () => {
    test("Capitalises first letter of lowercase country name", () => {
      const country = SiteUtil.getSiteCountry("northern ireland");
      expect(country).toBe("Northern Ireland");
    });

    test("Capitalises first letter of uppercase country name, lowercases the rest", () => {
      const country = SiteUtil.getSiteCountry("SCOTLAND");
      expect(country).toBe("Scotland");
    });
  });
});
