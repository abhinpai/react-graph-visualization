import { GraphComponent, SvgExport } from "yfiles";
import FileSaveSupport from "./FileSaveSupport";

export const exportSVGGraph = async (graphComponent) => {
  const exportComponent = new GraphComponent();
  exportComponent.graph = graphComponent.graph;
  exportComponent.updateContentRect();
  const targetRect = exportComponent.contentRect;
  const exporter = new SvgExport(targetRect);
  exporter.encodeImagesBase64 = true;
  exporter.inlineSvgImages = true;
  exporter.cssStyleSheet = null;
  const svgElement = await exporter.exportSvgAsync(exportComponent);
  console.log(svgElement);
  let fileContent = SvgExport.exportSvgString(svgElement);
  FileSaveSupport.save(fileContent, "graph.svg").catch(() => {
    alert(
      "Saving directly to the filesystem is not supported by this browser. Please use the server-based export instead."
    );
  });
};
