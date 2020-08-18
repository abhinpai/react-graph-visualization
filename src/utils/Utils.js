export function bindCommand(selector, command, target, parameter) {
    const element = document.querySelector(selector);
    if (arguments.length < 4) {
      parameter = null;
      if (arguments.length < 3) {
        target = null;
      }
    }
    if (!element) {
      return;
    }
    command.addCanExecuteChangedListener((_, ev) => {
      if (command.canExecute(parameter, target)) {
        element.removeAttribute("disabled");
      } else {
        element.setAttribute("disabled", "disabled");
      }
    });
    element.addEventListener("click", (e) => {
      if (command.canExecute(parameter, target)) {
        command.execute(parameter, target);
      }
    });
  }