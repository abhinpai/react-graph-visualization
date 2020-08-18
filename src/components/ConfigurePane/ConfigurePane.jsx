import React from "react";
import "./ConfigurePane.scss";
import CancelIcon from "@material-ui/icons/Cancel";

function ConfigurePane() {
  return (
    <div className="configurePane">
      <div id="graphOverviewComponent" className="demo-overview-container">
        <div className="demo-overview-header">Overview</div>
        <div id="overviewComponent"></div>
      </div>
    </div>
  );
}

export default ConfigurePane;
