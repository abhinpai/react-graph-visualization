import { GraphItemTypes, Point, INode, IEdge } from "yfiles";

export const initializeToolTip = (graphComponent) => {
  const mode = graphComponent.inputMode;
  mode.toolTipItems = GraphItemTypes.NODE || GraphItemTypes.EDGE;
  mode.mouseHoverInputMode.toolTipLocationOffset = new Point(10, 10);
  mode.addQueryItemToolTipListener((_, args) => {
    if (INode.isInstance(args.item) && !args.handled) {
      const nodeName = args.item.tag.label;
      if (nodeName !== null) {
        args.toolTip = nodeName;
        args.handled = true;
      }
    }
    if (IEdge.isInstance(args.item) && !args.handled) {
      const edgeType = args.item.tag.type;
      if (edgeType !== null) {
        args.toolTip = edgeType;
        args.handled = true;
      }
    }
  });
};
