import { Site } from "../../../model/DataPointTypes";
import { SearchResponse } from "../../../model/Api";

export class SearchStore {
  public locations: Site[] = [];

  constructor() {}

  // Save favourite sites in a smaller db? (rather than filtering through all of them?)
  public async getSearchResult(queryLocation: string): Promise<SearchResponse> {
    const body = { queryLocation };
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const rawResponse = await fetch("http://localhost:8080/search", request);
    const response = (await rawResponse.json()) as { searchResponse: SearchResponse };

    return response.searchResponse;
  }
}
