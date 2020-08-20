import { GraphEditorInputMode, GraphItemTypes } from "yfiles";
import { showInspectorPanel } from "./InspectorPaneManager";
import { zoomToLocation } from "./ZoomControlManager";

const initlizeGraphInputMode = (graphComponent) => {
  const mode = new GraphEditorInputMode();

  mode.addCanvasClickedListener((_, args) => {
    showInspectorPanel(args.item);
  });

  mode.addItemLeftClickedListener((_, args) => {
    // showInspectorPanel(args.item, graphComponent);
    // onclick of node zoom to the clicked location
    // zoomToLocation(args.item, graphComponent);
  });

  graphComponent.inputMode = mode;
  disableDefaultGraphFeature(graphComponent);
};

export const disableDefaultGraphFeature = (graphComponent) => {
  const mode = graphComponent.inputMode;
  mode.allowCreateEdge = false;
  mode.allowAddLabel = false;
  mode.allowCreateNode = false;
  mode.lassoSelectionInputMode.enabled = false;
  mode.labelEditableItems = GraphItemTypes.NONE;
  graphComponent.graph.decorator.nodeDecorator.reshapeHandleProviderDecorator.hideImplementation();
};
export default initlizeGraphInputMode;
