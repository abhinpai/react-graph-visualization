import {
  Color,
  IInputModeContext,
  INode,
  IRenderContext,
  NodeStyleBase,
  Point,
  Rect,
  SvgVisual,
  Visual,
} from "yfiles";

/**
 * A simple SVG node style consisting of one filled rect element.
 */
export default class SimpleSvgNodeStyle extends NodeStyleBase {
  /**
   * Constructs a node style with the given color or an orange node style if no color is defined.
   * @param {Color} color The fill color for the node.
   */
  constructor(color) {
    super();
    this.color = typeof color !== "undefined" ? color : new Color(255, 140, 0);
  }

  /**
   * Callback that creates the visual.
   * This method is called in response to a {@link IVisualCreator#createVisual}
   * call to the instance that has been queried from the {@link NodeStyleBase#renderer}.
   * @param {IRenderContext} context The render context.
   * @param {INode} node The node to which this style instance is assigned.
   * @return {Visual} The visual as required by the {@link IVisualCreator#createVisual}
   *   interface.
   * @see {@link NodeStyleBase#updateVisual}
   */
  createVisual(context, node) {
    const { x, y, width, height } = node.layout;

    // create a rect element
    const rect = window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute(
      "fill",
      `rgba(${this.color.r},${this.color.g},${this.color.b},${
        this.color.a / 255
      })`
    );

    // set the translation using a utility method for improved performance
    SvgVisual.setTranslate(rect, x, y);

    // store the data with which we created the rect so we can efficiently update it later
    rect["data-cache"] = { x, y, width, height };

    return new SvgVisual(rect);
  }

  /**
   * Callback that updates the visual previously created by {@link NodeStyleBase#createVisual}.
   * This method is called in response to a {@link IVisualCreator#updateVisual}
   * call to the instance that has been queried from the {@link NodeStyleBase#renderer}.
   * This implementation simply delegates to {@link NodeStyleBase#createVisual} so subclasses
   * should override to improve rendering performance.
   * @param {IRenderContext} context The render context.
   * @param {Visual} oldVisual The visual that has been created in the call to
   *   {@link NodeStyleBase#createVisual}.
   * @param {INode} node The node to which this style instance is assigned.
   * @return {Visual} The visual as required by the {@link IVisualCreator#createVisual}
   *   interface.
   * @see {@link NodeStyleBase#createVisual}
   */
  updateVisual(context, oldVisual, node) {
    const { x, y, width, height } = node.layout;
    // get the rect element
    const rect = oldVisual.svgElement;

    // get the cache we stored in CreateVisual
    const cache = rect["data-cache"];

    // update width and height only if necessary
    if (cache.width !== width || cache.height !== height) {
      rect.setAttribute("width", width.toString());
      rect.setAttribute("height", height.toString());
      cache.width = width;
      cache.height = height;
    }

    // update the location only if necessary
    if (cache.x !== x || cache.y !== y) {
      SvgVisual.setTranslate(rect, x, y);
      cache.x = x;
      cache.y = y;
    }

    return oldVisual;
  }

  /**
   * Determines whether the visual representation of the node has been hit at the given location.
   * Optimized implementation for a rectangular shape.
   * @see Overrides {@link NodeStyleBase#isHit}
   * @param {IInputModeContext} context The input mode context.
   * @param {Point} p The location to be checked.
   * @param {INode} node The node that may be hit.
   * @return {boolean}
   */
  isHit(context, p, node) {
    return node.layout.toRect().containsWithEps(p, context.hitTestRadius);
  }

  /**
   * Gets the intersection of a line with the visual representation of the node.
   * Optimized implementation for a rectangular shape.
   * @see Overrides {@link NodeStyleBase#getIntersection}
   * @param {INode} node The node.
   * @param {Point} inner The inner point of the line.
   * @param {Point} outer The outer point of the line.
   * @return {Point}
   */
  getIntersection(node, inner, outer) {
    return node.layout.toRect().findLineIntersection(inner, outer);
  }

  /**
   * Determines whether the provided point is geometrically inside the visual bounds of the node.
   * Optimized implementation for a rectangular shape.
   * @see Overrides {@link NodeStyleBase#isInside}
   * @param {INode} node The node.
   * @param {Point} point The point to be checked.
   * @return {boolean}
   */
  isInside(node, point) {
    return node.layout.toRect().contains(point);
  }

  /**
   * Determines whether the visualization for the specified node is included in the marquee selection.
   * Optimized implementation for a rectangular shape.
   * @see Overrides {@link NodeStyleBase#isInBox}
   * @param {IInputModeContext} context The input mode context.
   * @param {Rect} rectangle the rectangle to be checked.
   * @param {INode} node The node that may be in the rectangle.
   * @return {boolean}
   */
  isInBox(context, rectangle, node) {
    return rectangle.contains(node.layout);
  }
}
