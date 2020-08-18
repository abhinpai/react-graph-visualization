import React, { useEffect, useState } from "react";
import "./ConfigurePane.scss";
import { useDataLayer } from "../../state/DataLayer";
import { reConstructGraph } from "../../utils/GraphConstructor";

function ConfigurePane() {
  const [{ data, graph }, dispatch] = useDataLayer();
  const [firstLoad, setFirstLoad] = useState(true);
  const [state, setstate] = useState(100);

  const selectedSize = (size) => {
    dispatch({
      type: "SET_GRAPH_SIZE",
      payload: {
        size,
      },
    });
    setstate(size);
  };

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    reConstructGraph(data, graph);
  }, [state]);

  return (
    <div className="configurePane">
      <div className="graph-size-selector">
        <select
          name="Node & Edges"
          id="graph-size"
          onChange={(event) => selectedSize(event.target.value)}
        >
          <option value="100">100 Edges and Nodes</option>
          <option value="500">500 Edges and Nodes</option>
        </select>
      </div>

      <div id="graphOverviewComponent" className="demo-overview-container">
        <div className="demo-overview-header">Overview</div>
        <div id="overviewComponent"></div>
      </div>
    </div>
  );
}

export default ConfigurePane;
