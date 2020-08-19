import React from "react";
import "./Header.scss";
import { searchNode } from "../../utils/GraphSearch";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";

function Header() {
  return (
    <div className="header">
      <h2>Graph Visualizer</h2>
      <div className="undo-redo">
        <span data-command="Undo">
          <UndoIcon fontSize={"small"} />
        </span>
        <span data-command="Redo">
          <RedoIcon fontSize={"small"} />
        </span>
      </div>
      <input
        type="text"
        placeholder="Search node"
        onChange={(event) => searchNode(event.target.value)}
      />
    </div>
  );
}

export default Header;
