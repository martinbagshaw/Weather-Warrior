import { makeObservable, action, observable } from "mobx";
import { RootState } from "./RootState";

export class UserState {
  constructor(public rootState: RootState) {
    makeObservable(this);
  }

  public async init() {
    console.log("init user data");
    await this.rootState.rootStore.userStore.getUserData();
  }
}
