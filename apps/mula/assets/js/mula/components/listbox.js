const listbox = {
  mounted() {
    this.multiple = this.el.hasAttribute("aria-multiselectable");

    this.el.addEventListener("blur", (event) => {
      this.removeFocusedOption();
    });

    this.el.addEventListener("focus", (event) => {
      // focus is set on the first returned selected option or the first option
      // not disabled
      const nextOption =
        this.el.querySelector("[aria-selected=true]") ||
        this.getFirstAvailableOption();

      this.updateFocusedOption(nextOption);
    });

    this.el.addEventListener("mula:listbox:clicked", (event) => {
      this.toggleSelectedOption(event.target);
      this.updateFocusedOption(event.target);
    });

    this.el.addEventListener("keydown", (event) => {
      const key = event.key;
      const focusedOption = this.el.querySelector("[data-focused=true]");
      let nextFocusedOption;

      if (key == "Home") {
        nextFocusedOption = this.getFirstAvailableOption();
      } else if (key == "End") {
        nextFocusedOption = this.getLastAvailableOption();
      } else if (key == "ArrowDown") {
        nextFocusedOption = focusedOption.nextElementSibling;
      } else if (key == "ArrowUp") {
        nextFocusedOption = focusedOption.previousElementSibling;
      }

      this.updateFocusedOption(nextFocusedOption || focusedOption);
    });
  },

  getFirstAvailableOption() {
    return this.el.querySelector("[role=option]:not([disabled])");
  },

  getLastAvailableOption() {
    options = this.el.querySelectorAll("[role=option]:not([disabled])");
    return options[options.length - 1];
  },

  removeFocusedOption() {
    for (let option of this.el.querySelectorAll("[data-focused=true]")) {
      option.removeAttribute("data-focused");
    }
    this.el.setAttribute("aria-activedescendant", "");
  },

  updateFocusedOption(el) {
    this.removeFocusedOption();
    this.el.setAttribute("aria-activedescendant", el?.id);
    el?.setAttribute("data-focused", true);
  },

  selectOption(el, isSelected) {
    if (!this.multiple && isSelected == true) {
      for (let option of this.el.querySelectorAll("[aria-selected=true]")) {
        option.setAttribute("aria-selected", false);
        option.setAttribute("data-selected", false);
      }
    }

    if (!this.multiple) {
      this.el.dispatchEvent(
        new Event("mula:listbox:selection", { bubbles: true })
      );
    }

    el.setAttribute("aria-selected", isSelected);
    el.setAttribute("data-selected", isSelected);
  },

  toggleSelectedOption(el) {
    const isSelected = el.getAttribute("aria-selected") == "true";
    this.selectOption(el, !isSelected);
  },
};

export default listbox;
