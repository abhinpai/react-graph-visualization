import { GraphComponent, License } from "yfiles";
import LicenseFile from "../resources/license.json";
import {
  LargeGraphModelManager,
  OptimizationMode
} from "./LargeGraphModelManager";

let graphComponent = null;
let graphModelManager = null;

const initGraph = (div) => {
  License.value = LicenseFile;
  graphComponent = new GraphComponent();
  div.appendChild(graphComponent.div);

  // Graph Model Manager to improve the performance for a large graph
  graphModelManager = new LargeGraphModelManager(
    graphComponent,
    graphComponent.contentGroup
  );
  graphComponent.graphModelManager = graphModelManager;
  graphModelManager.graphOptimizationMode = OptimizationMode.DEFAULT;
  graphComponent.invalidate();
  graphModelManager.dirty = true;
  return graphComponent;
};

export default initGraph;
