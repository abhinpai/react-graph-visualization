import AddIcon from "@material-ui/icons/Add";
import CropFreeIcon from "@material-ui/icons/CropFree";
import RemoveIcon from "@material-ui/icons/Remove";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import React from "react";
import { useDataLayer } from "../../state/DataLayer";
import { exportSVGGraph } from "../../utils/GraphExport";
import "./Footer.scss";
import { hide as hideInspectorPane } from "../../utils/InspectorPaneManager";

function Footer() {
  const [{ graph }] = useDataLayer();

  return (
    <div className="footer">
      <span onClick={(() => exportSVGGraph(graph), hideInspectorPane)}>
        <SystemUpdateAltIcon fontSize={"small"} />
      </span>
      <span data-command="ZoomIn">
        <AddIcon fontSize={"small"} />
      </span>
      <span data-command="ZoomOut">
        <RemoveIcon fontSize={"small"} />
      </span>
      <span data-command="ZoomRest" onClick={hideInspectorPane}>
        <CropFreeIcon fontSize={"small"} />
      </span>
    </div>
  );
}

export default Footer;
