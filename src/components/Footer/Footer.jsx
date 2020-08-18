import React from "react";
import "./Footer.scss";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CropFreeIcon from "@material-ui/icons/CropFree";

function Footer() {
  return (
    <div className="footer">
      <span data-command="ZoomIn">
        <AddIcon fontSize={"small"} />
      </span>
      <span data-command="ZoomOut">
        <RemoveIcon fontSize={"small"} />
      </span>
      <span data-command="ZoomRest">
        <CropFreeIcon fontSize={"small"} />
      </span>
    </div>
  );
}

export default Footer;
