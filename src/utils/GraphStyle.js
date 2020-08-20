import {
  Arrow,
  ArrowType,
  DefaultLabelStyle,
  Fill,
  InteriorLabelModel,
  InteriorStretchLabelModel,
  InteriorStretchLabelModelPosition,
  MarkupLabelStyle,
  PolylineEdgeStyle,
  Size,
  SmartEdgeLabelModel,
  Stroke,
} from "yfiles";
import { INTERMEDIATE_NODE_HEIGHT, INTERMEDIATE_NODE_WIDTH } from "./Constants";
import CustomNodeStyle from "./CustomNodeStyle";

export const initGraphStyle = (graph, nodesSource, edgeSource) => {
  setNodeStyle(graph);
  setNodeLabelStyle(graph, nodesSource);
  setEdgeStyle(graph);
};

const setEdgeStyle = (graph) => {
  graph.edgeDefaults.labels.style = new DefaultLabelStyle({
    textFill: "#b8b8b8",
  });

  graph.edgeDefaults.labels.layoutParameter = new SmartEdgeLabelModel({
    autoRotation: true,
  }).createParameterFromSource(0, 10.0, 0.5);

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
};

const setNodeStyle = (graph) => {
  const customNodeStyle = new CustomNodeStyle();
  graph.nodeDefaults.size = getNodeStyle(
    INTERMEDIATE_NODE_WIDTH,
    INTERMEDIATE_NODE_HEIGHT
  );
  graph.nodeDefaults.style = customNodeStyle;
};

const setNodeLabelStyle = (graph, nodesSource) => {
  const centerLabelModel = new InteriorStretchLabelModel({ insets: 5 });
  const centerParameter = centerLabelModel.createParameter(
    InteriorStretchLabelModelPosition.CENTER
  );
  graph.nodeDefaults.labels.layoutParameter = centerParameter;
  const labelCreator = nodesSource.nodeCreator.createLabelsSource((data) => [
    { label: data.label },
    { type: `<span style="letter-spacing: 0.6px;">${data.type}</span>` },
    { datatype: data.datatype },
    { description: data.description },
  ]).labelCreator;

  labelCreator.textProvider = (data) => data.label || data.type;

  labelCreator.layoutParameterProvider = (data) => {
    if (data.type) {
      return InteriorLabelModel.WEST;
    }
    return InteriorLabelModel.WEST;
  };

  labelCreator.styleProvider = (data) => {
    if (data.type) {
      return contetLabelStyle;
    }
    return headerLabelStyle;
  };
};

const headerLabelStyle = new MarkupLabelStyle({
  font: "14px Tahoma",
  textFill: "white",
  wrapping: "word-ellipsis",
  horizontalTextAlignment: "Left",
  insets: [6, 0, 0, 6],
});

const contetLabelStyle = new MarkupLabelStyle({
  font: "10px Tahoma",
  wrapping: "word-ellipsis",
  textFill: "#b8b8b8",
  insets: [40, 0, 0, 6],
});

const getNodeStyle = (width, height) => new Size(width, height);
