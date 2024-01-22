import { Search } from "./Search";

/**
 * Controller
 *
 * Each subclass here controls the operations of an individual endpoint
 * These are used in index.ts
 */
export class Controller {
  public search: Search;

  constructor() {
    this.search = new Search();
  }
}
