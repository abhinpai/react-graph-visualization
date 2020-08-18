import React from "react";
import ConfigurePane from "../ConfigurePane/ConfigurePane";
import InspectorPane from "../InspectorPane/InspectorPane";
import "./GraphContainer.scss";
import GraphView from "../GraphView/GraphView";
import { useDataLayer } from "../../state/DataLayer";

function GraphContainer() {
  const [{ data }] = useDataLayer();

  return (
    <div className="graphContainer">
      <ConfigurePane />
      <div className="graphContainer__graph">
        <GraphView graphData={data} />
      </div>
      <InspectorPane />
    </div>
  );
}

export default GraphContainer;
