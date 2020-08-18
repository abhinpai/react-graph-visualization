import { GraphBuilder } from "yfiles";
import initlizeGraphLayout from "./GraphLayout";
import initGraphStyle from "./GraphStyle";

let nodesSource = null;
let edgesSource = null;
let graphBuilder = null;
const constructGraph = (graphData, reConstruct) => {
  graphBuilder = new GraphBuilder();

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

export const reConstructGraph = async (graphData, graphComponent) => {
  console.log(graphData.nodes.length);
  graphBuilder.setData(edgesSource, graphData.edges);
  graphBuilder.setData(nodesSource, graphData.nodes);
  graphBuilder.updateGraph();
  await initlizeGraphLayout(graphComponent);
};
