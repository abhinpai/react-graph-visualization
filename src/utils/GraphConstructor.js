import { GraphBuilder, FilteredGraphWrapper } from "yfiles";
import initlizeGraphLayout from "./GraphLayout";
import initGraphStyle from "./GraphStyle";

let nodesSource = null;
let edgesSource = null;
let graphBuilder = null;

const constructGraph = (graphData) => {
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

export const updateGraph = async (graphData, graphComponent) => {
  graphBuilder.setData(edgesSource, graphData.edges);
  graphBuilder.setData(nodesSource, graphData.nodes);
  graphBuilder.updateGraph();
  await initlizeGraphLayout(graphComponent);
};

export const reConstructGraph = async (graphData, graphComponent) =>{
  graphComponent.graph = constructGraph(graphData)
  await initlizeGraphLayout(graphComponent)
}

export const filterGraphNodes = async (graphComponent, type) => {
  const wrapper = new FilteredGraphWrapper(
    graphBuilder.buildGraph(),
    (node) => node.tag.type === type,
    (edge) => true
  );
  graphComponent.graph = wrapper;
  await initlizeGraphLayout(graphComponent)
};
