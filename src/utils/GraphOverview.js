import {
  GraphOverviewComponent,
  GraphOverviewCanvasVisualCreator,
} from "yfiles";

let overviewComponent = null;
const initilizeGraphOverview = (graphComponent) => {
  overviewComponent = new GraphOverviewComponent("overviewComponent");
  overviewComponent.graphComponent = graphComponent;
  overviewComponent.graphVisualCreator = new DemoStyleOverviewPaintable(
    graphComponent.graph
  );
  return overviewComponent;
};

class DemoStyleOverviewPaintable extends GraphOverviewCanvasVisualCreator {
  paintNode(renderContext, ctx, node) {
    ctx.fillStyle = "rgb(128, 128, 128)";
    const layout = node.layout;
    ctx.fillRect(layout.x, layout.y, layout.width, layout.height);
  }
  paintGroupNode(renderContext, ctx, node) {
    ctx.fill = "rgb(211, 211, 211)";
    ctx.fillStyle = "rgb(211, 211, 211)";
    ctx.strokeStyle = "rgb(211, 211, 211)";
    ctx.lineWidth = 4;
    const layout = node.layout;
    ctx.strokeRect(layout.x, layout.y, layout.width, layout.height);
    ctx.fillRect(layout.x, layout.y, layout.width, 22);
    ctx.lineWidth = 1;
  }
}

export default initilizeGraphOverview;
