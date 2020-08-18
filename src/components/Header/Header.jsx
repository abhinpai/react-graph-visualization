import React from "react";
import "./Header.scss";
import { searchNode } from "../../utils/GraphSearch";

function Header() {
  return (
    <div className="header">
      <h2>Graph Visualizer</h2>
      <input
        type="text"
        placeholder="Search node"
        onChange={(event) => searchNode(event.target.value)}
      />
    </div>
  );
}

export default Header;
