import React from "react";
import { createRoot } from "react-dom/client";

import "./reset.css";
import "./app.css";
import { RootStore } from "./store/RootStore";
import { RootState } from "./state/RootState";
import { AppRouter } from "./AppRouter";

export class App {
  private readonly rootStore: RootStore;
  private readonly rootState: RootState;

  constructor(public html: HTMLElement) {
    // const browserHistory = createBrowserHistory()// from history
    // this.routes = new Routes(browserHistory)
    this.rootStore = new RootStore();

    this.rootState = new RootState(this.rootStore); // ,this.routes
  }

  public async init() {
    const ready = await this.rootState.init();
    if (ready) {
      const root = createRoot(this.html);

      const component = <AppRouter rootState={this.rootState} />;
      root.render(component);
    } else {
      console.log("not ready");
    }
  }
}
