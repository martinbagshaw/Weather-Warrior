import { SearchStore } from "./SearchStore";
import { UserStore } from "./UserStore";

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
