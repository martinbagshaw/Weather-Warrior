import { Sites } from "./Sites";

/**
 * Controller
 *
 * Each subclass here controls the operations of an individual endpoint
 * These are used in index.ts
 */
export class Controller {
  public sites: Sites;
  constructor() {
    this.sites = new Sites();
  }
}
