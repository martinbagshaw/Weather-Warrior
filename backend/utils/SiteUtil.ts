export class SiteUtil {
  public static getSiteCountry(siteCountry: string): string {
    const countryWords: string[] = [];
    siteCountry.split(" ").forEach((w) => {
      const firstLetter = w.charAt(0).toUpperCase();
      const remainingLetters = w.toLowerCase().substring(1);
      countryWords.push(`${firstLetter}${remainingLetters}`);
    });

    return countryWords.join(" ");
  }
}
