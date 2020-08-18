import React, { useEffect, useState } from "react";
import "./ConfigurePane.scss";
import { useDataLayer } from "../../state/DataLayer";
import { updateGraph, filterGraphNodes, reConstructGraph } from "../../utils/GraphConstructor";

function ConfigurePane() {
  const [{ data, graph, nodeClass }, dispatch] = useDataLayer();
  const [load, setLoad] = useState({ size: true, type: true });
  const [state, setstate] = useState(100);
  const [classes, setClasses] = useState([]);

  const selectedSize = (size) => {
    dispatch({
      type: "SET_GRAPH_SIZE",
      payload: {
        size,
      },
    });
    setstate(size);
  };

  const filterGraph = (type) => {
    dispatch({
      type: "SET_NODE_CLASS",
      payload: {
        type,
      },
    });
  };

  useEffect(() => {
    let types = data.nodes.map((node, index) => node.type);
    types = ["All", ...types];
    setClasses(types.filter((type, index) => types.indexOf(type) === index));
    if (load.size) {
      setLoad({ ...load, size: false });
      return;
    }
    updateGraph(data, graph);
  }, [data]);

  useEffect(() => {
    if (load.type) {
      setLoad({ ...load, type: false });
      return;
    }
    if(nodeClass === "All"){
      reConstructGraph(data, graph);
    }else{
      filterGraphNodes(graph, nodeClass)
    }
  }, [nodeClass]);

  return (
    <div className="configurePane">
      <div className="graph-selector">
        <select
          name="Node & Edges"
          id="graph-size"
          onChange={(event) => selectedSize(event.target.value)}
        >
          <option value="100">100 Edges and Nodes</option>
          <option value="500">500 Edges and Nodes</option>
          <option value="750">750 Edges and Nodes</option>
        </select>
      </div>
      <br />

      <div className="graph-selector">
        <select
          name="Filter by class"
          id="nodes-type"
          onChange={(event) => filterGraph(event.target.value)}
        >
          {classes.map((x, index) => (
            <option key={index} value={x}>
              {x}
            </option>
          ))}
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
