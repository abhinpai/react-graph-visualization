import React, { useEffect } from "react";
import "./InspectorPane.scss";
import {
  initilizeInspectorPane,
  hide as hideInspectorPane,
} from "../../utils/InspectorPaneManager";
import CancelIcon from "@material-ui/icons/Cancel";

function InspectorPane() {
  useEffect(() => {
    initilizeInspectorPane();
  }, []);

  return (
    <div className="inspectorPane" id="inspector-pane">
      <p className="inspectorPane__header">
        Inspector Panel
        <span onClick={hideInspectorPane}>
          <CancelIcon fontSize={"small"} />
        </span>
      </p>
      <div className="properties" id="node-view">
        <p className="properties__title">
          Node Id <br />
          <span id="node-id" className="properties__value"></span>
        </p>
        <p className="properties__title">
          Label <br />
          <span id="node-label" className="properties__value"></span>
        </p>
        <p className="properties__title">
          Description <br />
          <span id="node-description" className="properties__value"></span>
        </p>
        <p className="properties__title">
          Node Type <br />
          <span id="node-type" className="properties__value"></span>
        </p>
      </div>

      <div className="properties" id="relationship-view">
        <p className="properties__title">
          Relationship Name <br />
          <span id="relationship-name" className="properties__value"></span>
        </p>
        <p className="properties__title">
          Description <br />
          <span
            id="relationship-description"
            className="properties__value"
          ></span>
        </p>
        <p className="properties__title">
          Source Node <br />
          <span id="relationship-source" className="properties__value"></span>
        </p>
        <p className="properties__title">
          Target Node <br />
          <span id="relationship-target" className="properties__value"></span>
        </p>
      </div>
    </div>
  );
}

export default InspectorPane;
