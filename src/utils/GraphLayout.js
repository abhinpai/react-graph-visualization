import { OrganicLayout } from "yfiles";

const initlizeGraphLayout = async (graphComponent) => {
  const layout = new OrganicLayout();
  layout.preferredEdgeLength = 40;
  layout.nodeEdgeOverlapAvoided = true;
  layout.nodeOverlapsAllowed = true;
  layout.compactnessFactor = 0.4;

  await graphComponent.morphLayout({
    layout: layout,
    morphDuration: "1s",
  });
};

export default initlizeGraphLayout;
