import { GraphEditorInputMode } from "yfiles";
import { showInspectorPanel } from "./InspectorPaneManager";
import { zoomToLocation } from "./ZoomControlManager";

const initlizeGraphInputMode = (graphComponent) => {
  const mode = new GraphEditorInputMode();
  mode.allowCreateEdge = false;
  mode.allowAddLabel = false;
  mode.allowCreateNode = false;
  mode.lassoSelectionInputMode.enabled = false;

  mode.addCanvasClickedListener((_, args) => {
    showInspectorPanel(args.item);
  });

  mode.addItemLeftClickedListener((_, args) => {
    showInspectorPanel(args.item, graphComponent);
    
    // onclick of node zoom to the clicked location
    // zoomToLocation(args.item, graphComponent);
  });

  graphComponent.graph.decorator.nodeDecorator.reshapeHandleProviderDecorator.hideImplementation();

  graphComponent.inputMode = mode;
};
export default initlizeGraphInputMode;
