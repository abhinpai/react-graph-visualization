import { NodeStyleBase, SvgVisual } from "yfiles";

export default class CustomNodeStyle extends NodeStyleBase {
  constructor() {
    super();
    this.cssClass = "";
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
    // const zoom = renderContext.zoom;
    // if (zoom >= 0.7) {
    //   rect.setAttribute("fill", "#FFC34E");
    //   rect.setAttribute("stroke", "#FFC34E");
    // } else if (zoom >= 0.4) {
    //   rect.setAttribute("fill", "#F6545C");
    //   rect.setAttribute("stroke", "#F6545C");
    // } else {
    //   rect.setAttribute("fill", "#0779e4");
    //   rect.setAttribute("stroke", "#0779e4");
    // }

    rect.setAttribute("fill", "#F6545C");
    rect.setAttribute("stroke", "#F6545C");

    rect["data-renderDataCache"] = {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      cssClass: this.cssClass,
    };

    g.setAttribute("transform", "translate(" + layout.x + " " + layout.y + ")");
    this.addLoadIndicator(node, g);

    return new SvgVisual(g);
  }

  // This method is responsible to add the custom decorator to the node
  addLoadIndicator(node, g) {
    const loadIndicator = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );

    let indicatorColor;

    if (node.tag.type === "iot.Element") {
      indicatorColor = "red";
    } else if (node.tag.type === "iot.Point") {
      indicatorColor = "yellow";
    } else {
      indicatorColor = "green";
    }
    loadIndicator.setAttribute("cx", 0);
    loadIndicator.setAttribute("cy", 0);
    loadIndicator.setAttribute("rx", "6");
    loadIndicator.setAttribute("ry", "6");
    loadIndicator.setAttribute("stroke-width", 1.5);
    loadIndicator.setAttribute("stroke", "#1a172f");
    loadIndicator.setAttribute("fill", indicatorColor);
    loadIndicator.setAttribute("transform", "translate(60,16)");
    g.appendChild(loadIndicator);
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
