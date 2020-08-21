import { FilteredGraphWrapper, GraphBuilder } from "yfiles";
import initlizeGraphLayout from "./GraphLayout";
import { initGraphStyle } from "./GraphStyle";

let nodesSource = null;
let edgesSource = null;
let graphBuilder = null;
let tempGraph = null;

const constructGraph = (graphData) => {
  graphBuilder = new GraphBuilder();

  nodesSource = graphBuilder.createNodesSource({
    data: graphData.nodes,
    id: "id",
    tag: (data) => data,
  });

  edgesSource = graphBuilder.createEdgesSource({
    data: graphData.edges,
    sourceId: "from",
    targetId: "to",
    labels: (data) => data.name || data.type,
  });

  initGraphStyle(graphBuilder.graph, nodesSource, edgesSource);
  tempGraph = graphBuilder.buildGraph();
  return tempGraph;
};

export default constructGraph;

export const updateGraph = async (graphData, graphComponent) => {
  graphBuilder.setData(edgesSource, graphData.edges);
  graphBuilder.setData(nodesSource, graphData.nodes);
  graphBuilder.updateGraph();
  await initlizeGraphLayout(graphComponent);
};

export const reConstructGraph = async (graphData, graphComponent) => {
  graphComponent.graph = constructGraph(graphData);
  await initlizeGraphLayout(graphComponent);
};

export const filterGraphNodes = async (graphComponent, type) => {
  const wrapper = new FilteredGraphWrapper(
    tempGraph,
    (node) => node.tag.type === type,
    (edge) => true
  );
  console.log(wrapper.nodes);
  graphComponent.graph = wrapper;
  await initlizeGraphLayout(graphComponent);
};
