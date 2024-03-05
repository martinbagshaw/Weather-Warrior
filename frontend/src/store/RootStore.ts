import { SearchStore } from "./SearchStore";
import { UserStore } from "./UserStore";

/**
 * Stores should be used when data is required in multiple places (e.g. routes) within the app
 *
 * UserStore:
 * - Data here will be required by UserState and SearchState
 * - E.g. user location
 *
 * SearchStore:
 * - This may not be required elsewhere (as in places other than SearchState)
 * - Currently, the backend endpoint to get the search result is called here. Nothing is stored
 * - If not required, should be removed
 *
 * Case for keeping:
 * - In UserState, the user could have their favourite locations displayed
 * - This would probably use some of the same data shapes used for Locations (a member of search)
 *
 *
 */
export class RootStore {
  searchStore: SearchStore;
  userStore: UserStore;

  constructor() {
    this.searchStore = new SearchStore();
    this.userStore = new UserStore();
  }

  // public async load() {
  //   /*
  //   Load user data on startup
  //   - not sure what, this will depend upon routes. May not require anything for default (search) view

  //   */
  // }
}
