import { ICommand, INode, Point, TimeSpan } from "yfiles";
import { detectiOSVersion, detectSafariVersion } from "./Workarounds.js";

export default class ContextMenu {
  constructor(graphComponent) {
    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("class", "demo-context-menu");
    this.element = contextMenu;
    this.blurredTimeout = null;
    this.isOpen = false;

    this.focusOutListener = (evt) => {
      this.onFocusOut(evt.relatedTarget);
    };

    this.focusInListener = () => {
      if (this.blurredTimeout) {
        clearTimeout(this.blurredTimeout);
        this.blurredTimeout = null;
      }
    };

    this.closeListener = (evt) => {
      evt.stopPropagation();
      this.close();
      // Set the focus to the graph component
      graphComponent.focus();
      this.onClosedCallback();
    };

    this.closeOnEscListener = (evt) => {
      if (evt.keyCode === 27 && this.element.parentNode) {
        this.closeListener(evt);
      }
    };

    graphComponent.longPressTime = TimeSpan.fromMilliseconds(100);
  }

  addSeparator() {
    const separator = document.createElement("div");
    separator.setAttribute("class", "demo-separator");
    this.element.appendChild(separator);
  }

  addMenuItem(label, clickListener) {
    const menuItem = document.createElement("button");
    menuItem.setAttribute("class", "demo-menu-item");
    menuItem.innerHTML = label;
    if (clickListener !== null) {
      menuItem.addEventListener("click", clickListener, false);
    }
    this.element.appendChild(menuItem);
    return menuItem;
  }

  clearItems() {
    const element = this.element;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  show(location) {
    if (this.element.childElementCount <= 0) {
      return;
    }
    this.element.addEventListener("focusout", this.focusOutListener);
    this.element.addEventListener("focusin", this.focusInListener);
    this.element.addEventListener("click", this.closeListener, false);
    document.addEventListener("keydown", this.closeOnEscListener, false);

    const style = this.element.style;
    style.setProperty("position", "absolute", "");
    style.setProperty("left", `${location.x}px`, "");
    style.setProperty("top", `${location.y}px`, "");
    document.body.appendChild(this.element);

    // trigger enter animation
    setTimeout(() => {
      this.element.setAttribute(
        "class",
        `${this.element.getAttribute("class")} visible`
      );
    }, 0);
    this.element.firstElementChild.focus();
    this.isOpen = true;
  }

  close() {
    this.element.removeEventListener("focusout", this.focusOutListener);
    this.element.removeEventListener("focusin", this.focusInListener);
    this.element.removeEventListener("click", this.closeListener, false);
    document.removeEventListener("keydown", this.closeOnEscListener, false);

    const parentNode = this.element.parentNode;
    if (parentNode) {
      // trigger fade-out animation on a clone
      const contextMenuClone = this.element.cloneNode(true);
      contextMenuClone.setAttribute(
        "class",
        `${contextMenuClone.getAttribute("class")} demo-context-menu-clone`
      );
      parentNode.appendChild(contextMenuClone);
      // fade the clone out, then remove it from the DOM. Both actions need to be timed.
      setTimeout(() => {
        contextMenuClone.setAttribute(
          "class",
          contextMenuClone.getAttribute("class").replace(/\s?visible/, "")
        );

        setTimeout(() => {
          parentNode.removeChild(contextMenuClone);
        }, 300);
      }, 0);

      this.element.setAttribute(
        "class",
        this.element.getAttribute("class").replace(/\s?visible/, "")
      );
      parentNode.removeChild(this.element);
    }

    this.isOpen = false;
  }

  get onClosedCallback() {
    if (!this.onClosedCallbackField) {
      alert(
        "For this context menu, the onClosedCallback property must be set."
      );
    }
    return this.onClosedCallbackField;
  }

  set onClosedCallback(callback) {
    this.onClosedCallbackField = callback;
  }

  addOpeningEventListeners(graphComponent, openingCallback) {
    const componentDiv = graphComponent.div;
    const contextMenuListener = (evt) => {
      evt.preventDefault();
      if (this.isOpen) {
        // might be open already because of the longpress listener
        return;
      }
      const me = evt;
      if (evt.mozInputSource === 1 && me.button === 0) {
        // This event was triggered by the context menu key in Firefox.
        // Thus, the coordinates of the event point to the lower left corner of the element and should be corrected.
        openingCallback(ContextMenu.getCenterInPage(componentDiv));
      } else if (me.pageX === 0 && me.pageY === 0) {
        // Most likely, this event was triggered by the context menu key in IE.
        // Thus, the coordinates are meaningless and should be corrected.
        openingCallback(ContextMenu.getCenterInPage(componentDiv));
      } else {
        openingCallback(new Point(me.pageX, me.pageY));
      }
    };
    componentDiv.addEventListener("contextmenu", contextMenuListener, false);

    if (detectSafariVersion() > 0 || detectiOSVersion() > 0) {
      // Additionally add a long press listener especially for iOS, since it does not fire the contextmenu event.
      let contextMenuTimer;
      graphComponent.addTouchDownListener((sender, args) => {
        contextMenuTimer = setTimeout(() => {
          openingCallback(
            graphComponent.toPageFromView(
              graphComponent.toViewCoordinates(args.location)
            )
          );
        }, 500);
      });
      graphComponent.addTouchUpListener(() => {
        clearTimeout(contextMenuTimer);
      });
    }

    // Listen to the context menu key to make it work in Chrome
    componentDiv.addEventListener("keyup", (evt) => {
      if (evt.keyCode === 93) {
        evt.preventDefault();
        openingCallback(ContextMenu.getCenterInPage(componentDiv));
      }
    });
  }

  onFocusOut(relatedTarget) {
    // focusout can also occur when the focus shifts between the buttons in this context menu.
    // We have to find out if none of the buttons has the focus and focusout is real
    if (relatedTarget) {
      if (
        relatedTarget.parentElement &&
        relatedTarget.parentElement !== this.element
      ) {
        this.close();
      }
    } else if (!this.blurredTimeout) {
      // If the browser doesn't provide a related target, we wait a little bit to see whether the focus is given to
      // another button in this context menu
      this.element.addEventListener("focusin", this.focusInListener);
      this.blurredTimeout = setTimeout(() => {
        this.close();
      }, 350);
    }
  }

  static getCenterInPage(element) {
    let left = element.clientWidth / 2.0;
    let top = element.clientHeight / 2.0;
    while (element.offsetParent) {
      left += element.offsetLeft;
      top += element.offsetTop;
      element = element.offsetParent;
    }
    return new Point(left, top);
  }
}

export const configureContextMenu = (graphComponent) => {
  const inputMode = graphComponent.inputMode;
  const contextMenu = new ContextMenu(graphComponent);
  contextMenu.addOpeningEventListeners(graphComponent, (location) => {
    if (
      inputMode.contextMenuInputMode.shouldOpenMenu(
        graphComponent.toWorldFromPage(location)
      )
    ) {
      contextMenu.show(location);
    }
  });
  inputMode.addPopulateItemContextMenuListener((sender, args) =>
    populateContextMenu(contextMenu, graphComponent, args)
  );
  inputMode.contextMenuInputMode.addCloseMenuListener(() => {
    contextMenu.close();
  });
  contextMenu.onClosedCallback = () => {
    inputMode.contextMenuInputMode.menuClosed();
  };
};

export const populateContextMenu = (contextMenu, graphComponent, args) => {
  args.showMenu = true;
  contextMenu.clearItems();
  const node = INode.isInstance(args.item) ? args.item : null;
  updateSelection(graphComponent, node);
  if (graphComponent.selection.selectedNodes.size > 0) {
    contextMenu.addMenuItem(
      "Expand Relationship",
      (s) => console.log("Sender", s),
      console.log("Clicked Expand Relationship")
    );
    contextMenu.addMenuItem("Hide Relationship", () =>
      console.log("Clicked Hide Relationship")
    );
    contextMenu.addMenuItem("Show Details", () =>
      console.log("Clicked Show Details")
    );
  } else {
    // no node has been hit
    contextMenu.addMenuItem("Select all", () =>
      ICommand.SELECT_ALL.execute(null, graphComponent)
    );
    contextMenu.addMenuItem("Someother menu item", () =>
      console.log("Selected Paste")
    );
  }
};

function updateSelection(graphComponent, node) {
  if (node === null) {
    graphComponent.selection.clear();
  } else if (!graphComponent.selection.selectedNodes.isSelected(node)) {
    graphComponent.selection.clear();
    graphComponent.selection.selectedNodes.setSelected(node, true);
    graphComponent.currentItem = node;
  }
}
