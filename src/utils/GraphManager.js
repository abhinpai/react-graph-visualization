export function showApp(graphComponent, overviewComponent) {
  if (graphComponent != null) {
    graphComponent.devicePixelRatio = window.devicePixelRatio || 1;
  }
  if (overviewComponent == null) {
    return;
  }

  overviewComponent.devicePixelRatio = window.devicePixelRatio || 1;
  const overviewContainer = overviewComponent.div.parentElement;
  const overviewHeader = overviewContainer.querySelector(
    ".demo-overview-header"
  );
  overviewHeader.addEventListener("click", () => {
    toggleClass(overviewContainer, "collapsed");
  });
}

function toggleClass(e, className) {
  if (hasClass(e, className)) {
    removeClass(e, className);
  } else {
    addClass(e, className);
  }
  return e;
}

function hasClass(e, className) {
  const classes = e.getAttribute("class") || "";
  const r = new RegExp(`\\b${className}\\b`, "");
  return r.test(classes);
}

function removeClass(e, className) {
  const classes = e.getAttribute("class");
  if (classes !== null && classes !== "") {
    if (classes === className) {
      e.setAttribute("class", "");
    } else {
      const result = classes
        .split(" ")
        .filter((s) => s !== className)
        .join(" ");
      e.setAttribute("class", result);
    }
  }
  return e;
}

function addClass(e, className) {
  const classes = e.getAttribute("class");
  if (classes === null || classes === "") {
    e.setAttribute("class", className);
  } else if (!hasClass(e, className)) {
    e.setAttribute("class", `${classes} ${className}`);
  }
  return e;
}
