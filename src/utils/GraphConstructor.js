import { GraphBuilder } from "yfiles";
import initGraphStyle from "./GraphStyle";

let nodesSource = null;
let edgesSource = null;

const constructGraph = (graphData) => {
  console.log(graphData.nodes.length, graphData.edges.length);
  const graphBuilder = new GraphBuilder();
  initGraphStyle(graphBuilder.graph);
  nodesSource = graphBuilder.createNodesSource({
    data: graphData.nodes,
    id: "id",
    labels: ["label"],
    tag: (data) => data,
  });
  edgesSource = graphBuilder.createEdgesSource({
    data: graphData.edges,
    sourceId: "from",
    targetId: "to",
  });
  return graphBuilder.buildGraph();
};
export default constructGraph;
