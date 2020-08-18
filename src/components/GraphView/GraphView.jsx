import React, { Component } from "react";
import "./GraphView.scss";
import "yfiles/yfiles.css";
import initGraph from "../../utils/GraphInitializer";
import constructGraph from "../../utils/GraphConstructor";
import initlizeGraphLayout from "../../utils/GraphLayout";
import initlizeGraphInputMode from "../../utils/GraphInputMode";
import initilizeGraphOverview from "../../utils/GraphOverview";
import { showApp } from "../../utils/GraphManager";
import { initlizeSearch } from "../../utils/GraphSearch";
import { initializeZoomControls } from "../../utils/ZoomControlManager";
import { initializeToolTip } from "../../utils/ToolTipManager";
import { configureContextMenu } from "../../utils/ContextMenuManager";

export default class GraphView extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.graphComponent = initGraph(this.div);
    this.graphComponent.graph = constructGraph(this.props.graphData);
    this.graphComponent.fitGraphBounds();
    initlizeGraphInputMode(this.graphComponent);
    await initlizeGraphLayout(this.graphComponent);
    initlizeSearch(this.graphComponent);
    initializeZoomControls(this.graphComponent);
    initializeToolTip(this.graphComponent);
    configureContextMenu(this.graphComponent);
    showApp(this.graphComponent, initilizeGraphOverview(this.graphComponent));
  }

  render() {
    return (
      <div className="graph">
        <div
          id="graph-component"
          className="graph-component-container"
          ref={(node) => {
            this.div = node;
          }}
        ></div>
      </div>
    );
  }
}
