import {
  Arrow,
  ArrowType,
  DefaultLabelStyle,
  Fill,
  Font,
  HorizontalTextAlignment,
  InteriorStretchLabelModel,
  InteriorStretchLabelModelPosition,
  PolylineEdgeStyle,
  Size,
  Stroke,
  TextWrapping,
  VerticalTextAlignment,
} from "yfiles";
import CustomNodeStyle from "./CustomNodeStyle";

const initGraphStyle = (graph) => {
  const customNodeStyle = new CustomNodeStyle();
  const centerLabelModel = new InteriorStretchLabelModel({ insets: 5 });
  const centerParameter = centerLabelModel.createParameter(
    InteriorStretchLabelModelPosition.CENTER
  );
  graph.nodeDefaults.size = new Size(60, 60);

  graph.nodeDefaults.style = customNodeStyle;
  graph.nodeDefaults.labels.style = new DefaultLabelStyle({
    textFill: "#fff",
    font: new Font("Robot, sans-serif", 14),
    wrapping: TextWrapping.CHARACTER_ELLIPSIS,
    verticalTextAlignment: VerticalTextAlignment.CENTER,
    horizontalTextAlignment: HorizontalTextAlignment.CENTER,
  });

  const sourceArrowStyle = new Arrow({
    type: ArrowType.CIRCLE,
    stroke: Stroke.GRAY,
    fill: Fill.GRAY,
    cropLength: 3,
  });

  const targetArrowStyle = new Arrow({
    type: ArrowType.TRIANGLE,
    stroke: Stroke.GRAY,
    fill: Fill.GRAY,
    cropLength: 4,
  });

  graph.edgeDefaults.style = new PolylineEdgeStyle({
    stroke: "2px dashed gray",
    sourceArrow: sourceArrowStyle,
    targetArrow: targetArrowStyle,
  });
  graph.nodeDefaults.labels.layoutParameter = centerParameter;
};
export default initGraphStyle;
