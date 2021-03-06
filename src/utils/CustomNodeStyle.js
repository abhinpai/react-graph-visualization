import { NodeStyleBase, SvgVisual } from "yfiles";
import { NODE_COLOR_1, NODE_COLOR_2, NODE_COLOR_3 } from "./Constants";

export default class CustomNodeStyle extends NodeStyleBase {
  constructor() {
    super();
    this.cssClass = "";
    this.imageUrl = "https://image.flaticon.com/icons/svg/908/908591.svg";
  }

  createVisual(renderContext, node) {
    const g = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    g.append(rect);

    const layout = node.layout;
    const nodeRounding = "4";
    rect.width.baseVal.value = layout.width;
    rect.height.baseVal.value = layout.height;
    rect.setAttribute("rx", nodeRounding);
    rect.setAttribute("ry", nodeRounding);
    rect.setAttribute("stroke-width", "1px");

    if (this.cssClass) {
      rect.setAttribute("class", this.cssClass);
    }

    // Dynamically change the node color based on the zoom level
    const zoom = renderContext.zoom;
    // this.dynamicNodecolor(zoom, rect);

    rect.setAttribute("fill", NODE_COLOR_3);
    rect.setAttribute("stroke", NODE_COLOR_3);

    rect["data-renderDataCache"] = {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      cssClass: this.cssClass,
    };

    g.setAttribute("transform", "translate(" + layout.x + " " + layout.y + ")");
    this.addLoadIndicator(node, g);
    this.addDecoratorImage(node, g);

    return new SvgVisual(g);
  }

  addDecoratorImage(node, g) {
    const decoratorImage = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    // decoratorImage.setAttribute("src", this.imageUrl);
    decoratorImage.setAttribute("height", "16");
    decoratorImage.setAttribute("width", "16");
    decoratorImage.setAttribute("id", "indicator");
    decoratorImage.setAttribute("href", this.imageUrl);
    decoratorImage.setAttribute("cx", 0);
    decoratorImage.setAttribute("cy", 0);
    decoratorImage.setAttribute("rx", "6");
    decoratorImage.setAttribute("ry", "6");
    decoratorImage.setAttribute("transform", `translate(6, 8)`);
    g.appendChild(decoratorImage);
  }

  // This method is responsible to add the custom decorator to the node
  addLoadIndicator(node, g) {
    const loadIndicator = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );
    let indicatorColor = null;

    if (node.tag.type === "iot.Element") {
      indicatorColor = "red";
    } else if (node.tag.type === "iot.Point") {
      indicatorColor = "#0090d9";
    } else if (node.tag.type === "hvac.Chiller") {
      indicatorColor = "#fba800";
    } else {
      indicatorColor = "#83f52c";
    }
    loadIndicator.setAttribute("cx", 0);
    loadIndicator.setAttribute("cy", 0);
    loadIndicator.setAttribute("rx", "6");
    loadIndicator.setAttribute("ry", "6");
    loadIndicator.setAttribute("stroke-width", 1.5);
    loadIndicator.setAttribute("fill", indicatorColor);
    loadIndicator.setAttribute(
      "transform",
      `translate(${node.layout.width - 15}, 16)`
    );
    g.appendChild(loadIndicator);
  }

  dynamicNodecolor(zoom, rect) {
    if (zoom >= 0.7) {
      rect.setAttribute("fill", NODE_COLOR_2);
      rect.setAttribute("stroke", NODE_COLOR_2);
    } else if (zoom >= 0.4) {
      rect.setAttribute("fill", NODE_COLOR_1);
      rect.setAttribute("stroke", NODE_COLOR_1);
    } else {
      rect.setAttribute("fill", NODE_COLOR_3);
      rect.setAttribute("stroke", NODE_COLOR_3);
    }
  }

  updateVisual(renderContext, oldVisual, node) {
    const rect = oldVisual.svgElement;
    const cache = rect["data-renderDataCache"];
    if (!cache) {
      return this.createVisual(renderContext, node);
    }

    const layout = node.layout;
    const width = layout.width;
    const height = layout.height;

    if (cache.width !== width) {
      rect.width.baseVal.value = width;
      cache.width = width;
    }
    if (cache.height !== height) {
      rect.height.baseVal.value = height;
      cache.height = height;
    }
    if (cache.x !== layout.x || cache.y !== layout.y) {
      rect.transform.baseVal.getItem(0).setTranslate(layout.x, layout.y);
      cache.x = layout.x;
      cache.y = layout.y;
    }

    if (cache.cssClass !== this.cssClass) {
      if (this.cssClass) {
        rect.setAttribute("class", this.cssClass);
      } else {
        rect.removeAttribute("class");
      }
      cache.cssClass = this.cssClass;
    }

    return oldVisual;
  }
}
