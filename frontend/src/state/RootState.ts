import { makeObservable, observable } from "mobx";

import { RootStore } from "../store/RootStore";
import { SearchState } from "./SearchState";
import { UserState } from "./UserState";

export class RootState {
  @observable.ref public userState: UserState;
  @observable.ref public searchState: SearchState;

  constructor(public rootStore: RootStore) {
    this.userState = new UserState(this);
    this.searchState = new SearchState(this);

    makeObservable(this);
  }

  public async init() {
    // TODO: Load basic user data - e.g. location
    await this.userState.init();
    return true;
  }
}
