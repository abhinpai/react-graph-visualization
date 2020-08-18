import { INode, IEdge } from "yfiles";

let inspectorPanel = null;
let nodeDiv = null;
let relationshipDiv = null;

export const initilizeInspectorPane = () => {
  inspectorPanel = document.getElementById("inspector-pane");
  nodeDiv = document.getElementById("node-view");
  relationshipDiv = document.getElementById("relationship-view");
};

export const showInspectorPanel = (item, graphComponent) => {
  if (IEdge.isInstance(item) || INode.isInstance(item)) {
    highlightClickedItem(item, graphComponent)
    if (INode.isInstance(item)) {
      bindDataToNodeDiv(item);
    } else {
      bindDataToRelationshipDiv(item);
    }
  } else {
    hide();
  }
};

const show = () => {
  inspectorPanel.style.marginRight = "0";
};

const hide = () => {
  inspectorPanel.style.marginRight = "-50%";
};

const bindDataToRelationshipDiv = (item) => {
  show();
  relationshipDiv.style.display = "block";
  nodeDiv.style.display = "none";
  const name = document.getElementById("relationship-name");
  const description = document.getElementById("relationship-description");
  const source = document.getElementById("relationship-source");
  const target = document.getElementById("relationship-target");
  name.textContent = item.tag.label ? item.tag.label : "Name not Set";
  description.textContent = item.tag.description
    ? item.tag.description
    : "Description not Set";
  source.textContent = item.sourcePort.owner.tag.label;
  target.textContent = item.targetPort.owner.tag.label;
};

const bindDataToNodeDiv = (item) => {
  show();
  nodeDiv.style.display = "block";
  relationshipDiv.style.display = "none";
  const label = document.getElementById("node-label");
  const id = document.getElementById("node-id");
  const desc = document.getElementById("node-description");
  const type = document.getElementById("node-type"); 
  label.textContent = item.tag.label;
  id.textContent = item.tag.id;
  desc.textContent = item.tag.description;
  type.textContent = item.tag.type;
};

const highlightClickedItem = (item, graphComponent) => {
  const manager = graphComponent.highlightIndicatorManager;
  if (IEdge.isInstance(item)) {
    manager.addHighlight(item);
    manager.addHighlight(item.sourceNode);
    manager.addHighlight(item.targetNode);
  }
  if (INode.isInstance(item)) {
    manager.addHighlight(item);
  }

  setTimeout(() => {
    manager.clearHighlights();
  }, 3000);
};
