import { OrganicLayout, OrganicEdgeRouter } from "yfiles";

const initlizeGraphLayout = async (graphComponent) => {
  const layout = new OrganicLayout();
  layout.preferredEdgeLength = 100;
  layout.preferredMinimumNodeToEdgeDistance  = 100;
  layout.nodeEdgeOverlapAvoided = true;
  layout.nodeOverlapsAllowed = false;
  layout.compactnessFactor = 0.4;
  layout.parallelEdgeRouter = new OrganicEdgeRouter({
    edgeNodeOverlapAllowed: true,
    keepExistingBends: false,
    routeAllEdges: true,
  });

  await graphComponent.morphLayout({
    layout: layout,
    morphDuration: "1s",
  });
};

export default initlizeGraphLayout;
