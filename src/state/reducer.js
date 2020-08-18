import data100 from "../resources/100.json";
import data500 from "../resources/500.json";

export const intialState = {
  graph: null,
  data: data100,
  nodeClass: "All",
  builder: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_GRAPH_COMPONENT":
      return { ...state, graph: action.payload.graph };
    case "SET_GRAPH_BUILDER":
      return { ...state, builder: action.payload.builder };
    case "SET_GRAPH_SIZE":
      return getData(state, action.payload.size);
    case "SET_NODE_CLASS":
      return { ...state, nodeClass: action.payload.type };
    default:
      return state;
  }
};

const getData = (state, size) => {
  switch (size) {
    case "100":
      return { ...state, data: data100 };
    case "500":
      return { ...state, data: data500 };
    default:
      return state;
  }
};

export default reducer;
