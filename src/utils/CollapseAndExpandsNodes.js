import {
  Bfs,
  CompositeLayoutData,
  FixNodeLayoutData,
  HashMap,
  HierarchicLayout,
  HierarchicLayoutData,
  IGraph,
  ILayoutAlgorithm,
  IList,
  INode,
  LayoutMode,
  List,
  OrganicLayout,
  OrganicLayoutData,
  OrganicLayoutScope,
  PlaceNodesAtBarycenterStage,
  PlaceNodesAtBarycenterStageData,
  LayoutExecutor,
  DefaultGraph,
  TemplateNodeStyle,
  Size,
  ExteriorLabelModel,
  FilteredGraphWrapper,
} from "yfiles";

class CollapseAndExpandNodes {
  constructor(graphComponent) {
    /** Map that stores whether a node is collapsed. */
    this.nodeCollapsedMap = new HashMap();

    /** Map that stores the node visibility. */
    this.nodeVisibility = new HashMap();

    this.graphComponent = graphComponent;
  }

  setCollapsed(node, collapsed) {
    this.nodeCollapsedMap.set(node, collapsed);
  }

  setNodeVisibility(node, visible) {
    this.nodeVisibility.set(node, visible);
  }

  getNodeVisibility(node) {
    return !!this.nodeVisibility.get(node);
  }

  /**
   * Show the children of a collapsed node.
   * @param {INode} node The node that should be expanded
   */
  expand(node) {
    // Stores the collapsed state of the node in the style tag in order
    // to be able to bind to it using a template binding.
    node.style.styleTag = { collapsed: false };
    this.nodeCollapsedMap.set(node, false);

    const filteredGraph = this.graphComponent.graph;
    this.getDescendants(filteredGraph.wrappedGraph, node, (succ) =>
      this.nodeCollapsedMap.get(succ)
    ).forEach((succ) => {
      this.nodeVisibility.set(succ, true);
    });
  }

  /**
   * Hide the children of a expanded node.
   * @param {INode} node The node that should be collapsed
   */
  collapse(node) {
    node.style.styleTag = { collapsed: true };
    this.nodeCollapsedMap.set(node, true);

    const filteredGraph = this.graphComponent.graph;
    this.getDescendants(filteredGraph.wrappedGraph, node, (succ) =>
      this.nodeCollapsedMap.get(succ)
    ).forEach((succ) => {
      this.nodeVisibility.set(succ, false);
    });
  }

  /**
   * Returns the descendants of the given node.
   *
   * @param {IGraph} graph The graph.
   * @param {INode} node The node.
   * @param {function(INode):boolean?} recursionFilter An optional node predicate that specifies whether
   *   the recursion should continue for the given node.
   * @return {IList.<INode>} The descendants of the given node.
   */
  getDescendants(graph, node, recursionFilter) {
    const visited = new HashMap();
    const descendants = new List();
    const nodes = [node];
    while (nodes.length > 0) {
      graph.successors(nodes.pop()).forEach((s) => {
        if (!visited.get(s)) {
          visited.set(s, true);
          descendants.add(s);
          if (recursionFilter == null || !recursionFilter(s)) {
            nodes.push(s);
          }
        }
      });
    }
    return descendants;
  }

  /**
   * Moves incremental nodes between their neighbors before expanding for a smooth animation.
   *
   * @param {HashMap} incrementalMap
   */
  prepareSmoothExpandLayoutAnimation(incrementalMap) {
    const graph = this.graphComponent.graph;

    // mark the new nodes and place them between their neighbors
    const layoutData = new PlaceNodesAtBarycenterStageData({
      affectedNodes: (node) => incrementalMap.has(node),
    });

    const layout = new PlaceNodesAtBarycenterStage();
    graph.applyLayout(layout, layoutData);
  }

  /**
   * Configures a new layout to the current graph.
   *
   * Incremental nodes are moved between their neighbors before expanding for a smooth animation.
   * @param {INode} toggledNode An optional toggled node. The children of this node are laid out as
   *   incremental items. Without affected node, a 'from scratch' layout is calculated.
   * @param {boolean} expand Whether this is part of an expand or a collapse action.
   * @param {CompositeLayoutData} currentLayoutData
   * @param {ILayoutAlgorithm} currentLayout
   */
  configureLayout(toggledNode, expand, currentLayoutData, currentLayout) {
    const graph = this.graphComponent.graph;
    if (toggledNode) {
      // Keep the clicked node at its location
      currentLayoutData.items.add(
        new FixNodeLayoutData({
          fixedNodes: toggledNode,
        })
      );

      const incrementalNodes = this.getDescendants(graph, toggledNode);
      const incrementalMap = new HashMap();
      incrementalNodes.forEach((node) => {
        incrementalMap.set(node, true);
      });

      if (expand) {
        // move the incremental nodes between their neighbors before expanding for a smooth animation
        this.prepareSmoothExpandLayoutAnimation(incrementalMap);
      } else {
        // configure PlaceNodesAtBarycenterStage for a smooth animation
        currentLayoutData.items.add(
          new PlaceNodesAtBarycenterStageData({
            affectedNodes: (node) => incrementalMap.has(node),
          })
        );
      }
      if (currentLayout instanceof OrganicLayout) {
        currentLayout.compactnessFactor = 0.7;
        currentLayout.preferredEdgeLength = 60;

        currentLayout.considerNodeSizes = false;
        currentLayout.nodeOverlapsAllowed = false;
        currentLayout.minimumNodeDistance = 10;
        currentLayout.qualityTimeRatio = 1;
        currentLayout.maximumDuration = 1000 + graph.nodes.size * 50;
        currentLayout.scope = OrganicLayoutScope.ALL;

        const layerIds = new Bfs({
          coreNodes: incrementalNodes.concat(toggledNode),
          traversalDirection: "both",
        }).run(graph).nodeLayerIds;

        currentLayoutData.items.add(
          new OrganicLayoutData({
            nodeInertia: (obj) => 1 - 1 / (layerIds.get(obj) + 1),
            nodeStress: (obj) => 1 / (layerIds.get(obj) + 1),
          })
        );
      } else if (currentLayout instanceof HierarchicLayout) {
        currentLayout.layoutMode = LayoutMode.INCREMENTAL;

        currentLayoutData.items.add(
          new HierarchicLayoutData({
            incrementalHints: (item, hintsFactory) => {
              if (incrementalNodes.includes(item)) {
                return hintsFactory.createLayerIncrementallyHint(item);
              }
            },
          })
        );
      }
    } else {
      if (currentLayout instanceof OrganicLayout) {
        currentLayout.scope = OrganicLayoutScope.ALL;
      } else if (currentLayout instanceof HierarchicLayout) {
        currentLayout.layoutMode = LayoutMode.FROM_SCRATCH;
      }
    }
  }
}

let collapseAndExpandComponent = null;
let runningLayout = false;

export const collapseAndExpandNodes = (graphComponent) => {
  collapseAndExpandComponent = new CollapseAndExpandNodes(graphComponent);
  const mode = graphComponent.inputMode;
  mode.addItemClickedListener(async (_, args) => {
    if (!INode.isInstance(args.item)) {
      return;
    }
    const node = args.item;
    console.log(graphComponent.graph.outDegree);
    const filteredGraph = graphComponent.graph;
    const canExpand =
      filteredGraph.outDegree(node) !==
      filteredGraph.wrappedGraph.outDegree(node);
    if (canExpand) {
      collapseAndExpandComponent.expand(node);
      filteredGraph.nodePredicateChanged();
      await runLayout(node, true, graphComponent);
    } else {
      collapseAndExpandComponent.collapse(node);
      await runLayout(node, false, graphComponent);
      filteredGraph.nodePredicateChanged();
    }
  });
  graphComponent.inputMode = mode;
};

async function runLayout(toggledNode, expand, graphComponent) {
  if (runningLayout) {
    return Promise.resolve();
  }
  runningLayout = true;

  const currentLayoutData = new CompositeLayoutData();

  collapseAndExpandComponent.configureLayout(
    toggledNode,
    expand,
    currentLayoutData,
    "Organic"
  );

  const layoutExecutor = new LayoutExecutor({
    graphComponent,
    layout: "Organic",
    layoutData: currentLayoutData,
    duration: "1s",
    animateViewport: toggledNode == null,
  });
  try {
    await layoutExecutor.start();
  } catch (error) {
    if (typeof window.reportError === "function") {
      window.reportError(error);
    } else {
      throw error;
    }
  } finally {
    runningLayout = false;
  }
}

export function initializeGraph(completeGraph) {
  // Create the graph instance that will hold the complete graph.
//   const completeGraph = new DefaultGraph();

//   // Create a new style that uses the specified svg snippet as a template for the node.
  const leafNodeStyle = new TemplateNodeStyle("LeafNodeStyleTemplate");

//   // Create a new style that uses the specified svg snippet as a template for the node.
//   completeGraph.nodeDefaults.style = new TemplateNodeStyle(
//     "InnerNodeStyleTemplate"
//   );
//   completeGraph.nodeDefaults.style.styleTag = { collapsed: true };
//   completeGraph.nodeDefaults.size = new Size(60, 30);
//   completeGraph.nodeDefaults.shareStyleInstance = false;
//   completeGraph.nodeDefaults.labels.layoutParameter = ExteriorLabelModel.SOUTH;

  buildTree(completeGraph, 5);
  console.log(collapseAndExpandComponent);

//   completeGraph.nodes.forEach((node) => {
//     // Initially, 3 levels are expanded and thus, 4 levels are visible
//     node.style.styleTag = { collapsed: node.tag.level > 2 };
//     collapseAndExpandComponent.setCollapsed(node, node.tag.level > 2);
//     collapseAndExpandComponent.setNodeVisibility(node, node.tag.level < 4);

//     // Set a different style to leaf nodes
//     if (completeGraph.outDegree(node) === 0) {
//       completeGraph.setStyle(node, leafNodeStyle);
//     }
//   });

  // Create a filtered graph of the original graph that contains only non-collapsed sub-parts.
  // The predicate methods specify which should be part of the filtered graph.
  return new FilteredGraphWrapper(
    completeGraph,
    (node) => collapseAndExpandComponent.getNodeVisibility(node),
    () => true
  );
}

function buildTree(graph, levelCount) {
  const root = graph.createNode({
    tag: { level: 0 },
  });
  addChildren(graph, root, 3, levelCount);
}

function addChildren(graph, root, childrenCount, levelCount) {
  const level = root.tag.level + 1;
  if (level >= levelCount) {
    return;
  }
  for (let i = 0; i < childrenCount; i++) {
    const child = graph.createNode({
      tag: { level: level },
    });
    graph.createEdge(root, child);
    addChildren(graph, child, Math.floor(4 * Math.random() + 1), levelCount);
  }
}
