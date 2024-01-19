import { configure } from "mobx";
import { App } from "./App";

configure({
  enforceActions: "observed",
  computedRequiresReaction: false,
  observableRequiresReaction: false,
});

const root = document.getElementById("root");

if (root) {
  const app = new App(root);
  app.init();
}
