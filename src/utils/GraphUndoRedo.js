import { ICommand } from "yfiles";
import { bindCommand } from "./Utils";

export const initializeUndoRedo = (graphComponent) => {
  bindCommand("span[data-command='Undo']", ICommand.UNDO, graphComponent);
  bindCommand("span[data-command='Redo']", ICommand.REDO, graphComponent);
  const graph = graphComponent.graph;
  // Enables undo on the graph. This will make the graph store the edits and will make the undo/redo commands work.
  graph.undoEngineEnabled = true;

  // Basically this means that from now on the following functionality will be available
  // and do something useful as soon as edits have been made.
  if (graph.undoEngineEnabled && graph.undoEngine) {
    if (graph.undoEngine.canUndo()) {
      graph.undoEngine.undo();
    }
    if (graph.undoEngine.canRedo()) {
      graph.undoEngine.redo();
    }
    graph.undoEngine.clear();
  }
};
