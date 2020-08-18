import { GraphEditorInputMode } from "yfiles";

const initlizeGraphInputMode = (graphComponent) => {
  const mode = new GraphEditorInputMode();
  mode.allowCreateEdge = false;
  mode.allowAddLabel = false;
  mode.allowCreateNode = false;
  mode.lassoSelectionInputMode.enabled = false;

  mode.addCanvasClickedListener((_, args) => {
    // this.showInspectorPanel(args.item);
  });

  mode.addItemLeftClickedListener((_, args) => {
    // this.showInspectorPanel(args.item);
    // zoomToLocation(args.item, this.graphComponent);
    // this.highlightClickedItem(args.item);
  });

  graphComponent.graph.decorator.nodeDecorator.reshapeHandleProviderDecorator.hideImplementation();

  graphComponent.inputMode = mode;
};
export default initlizeGraphInputMode;
