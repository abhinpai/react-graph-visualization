import { Fill, NodeStyleDecorationInstaller, ShapeNodeStyle } from "yfiles";
import { NODE_COLOR_1 } from "./Constants";
import { zoomToLocation } from "./ZoomControlManager";

let graphComponent = null;

export const initlizeSearch = (graph) => {
  graphComponent = graph;
  const searchHighlightStyle = new NodeStyleDecorationInstaller({
    nodeStyle: new ShapeNodeStyle({
      stroke: NODE_COLOR_1,
      fill: Fill.TRANSPARENT,
    }),
    margins: 3,
  });

  graph.graph.decorator.nodeDecorator.highlightDecorator.setImplementation(
    searchHighlightStyle
  );
};

export const searchNode = (query) => {
  const manager = graphComponent.highlightIndicatorManager;
  manager.clearHighlights();
  if (query.trim() !== "") {
    graphComponent.graph.nodes.forEach((node) => {
      if (matches(node, query)) {
        manager.addHighlight(node);
        zoomToLocation(node, graphComponent);
      }
    });
  }
};

const matches = (node, query) => {
  const property = Object.values(node.tag);
  return property.some(
    (label) => label.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
};
