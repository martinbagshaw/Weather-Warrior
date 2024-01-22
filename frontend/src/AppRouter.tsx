import { observer } from "mobx-react";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import React, { Component, Fragment } from "react";
import { RootState } from "./state/RootState";

interface AppRouterProps {
  rootState: RootState;
}

@observer
export class AppRouter extends Component<AppRouterProps> {
  public constructor(props: AppRouterProps) {
    super(props);
  }
  /*
  TODO: setup different components to respond to different routes here
  - main = search tool
  - favourites = saved places, can add information to them
  
  */
  public render() {
    return (
      <Fragment>
        <Header />
        <Main rootState={this.props.rootState} />
      </Fragment>
    );
  }
}
