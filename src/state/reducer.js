export const intialState = {
  graph: null,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_GRAPH_COMPONENT":
      return { ...state, graph: action.payload.graph };
    default:
      return state;
  }
};

export default reducer;
