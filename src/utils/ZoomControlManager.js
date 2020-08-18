import { IEdge, INode, Point, ICommand } from "yfiles";
import { bindCommand } from "./Utils";

export const initializeZoomControls = (graphComponent) =>{
    bindCommand(
        "span[data-command='ZoomIn']",
        ICommand.INCREASE_ZOOM,
        graphComponent,
        null
      );
      bindCommand(
        "span[data-command='ZoomOut']",
        ICommand.DECREASE_ZOOM,
        graphComponent,
        null
      );
      bindCommand(
        "span[data-command='ZoomRest']",
        ICommand.FIT_GRAPH_BOUNDS,
        graphComponent,
        null
      );
}

export const zoomToLocation = (item, graphComponent) => {
  const location = getFocusPoint(item, graphComponent);
  graphComponent.zoomToAnimated(location, graphComponent.zoom);
};

const getFocusPoint = (item, graphComponent) => {
  if (IEdge.isInstance(item)) {
    const targetNodeCenter = item.targetNode.layout.center;
    const sourceNodeCenter = item.sourceNode.layout.center;
    const viewPort = graphComponent.viewport;
    if (
      viewPort.contains(targetNodeCenter) &&
      viewPort.contains(sourceNodeCenter)
    ) {
      return new Point(
        (sourceNodeCenter.x + targetNodeCenter.x) / 2,
        (sourceNodeCenter.y + targetNodeCenter.y) / 2
      );
    } else {
      if (
        viewPort.center.subtract(targetNodeCenter).vectorLength <
        viewPort.center.subtract(sourceNodeCenter).vectorLength
      ) {
        return sourceNodeCenter;
      }
      return targetNodeCenter;
    }
  } else if (INode.isInstance(item)) {
    return item.layout.center;
  }
  return null;
};
