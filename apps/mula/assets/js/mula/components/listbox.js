const EVENTS = {
  SELECT: "mula:listbox:select",
  UPDATED: "mula:listbox:updated",
};

const isMacOS = () => {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
};

const Listbox = {
  mounted() {
    this.multiple = this.el.hasAttribute("aria-multiselectable");

    this._handleDocumentFocus = this.handleDocumentFocus.bind(this);
    this._handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this._handleDocumentBlur = this.handleDocumentBlur.bind(this);
    this._handleOptionSelected = this.handleOptionSelected.bind(this);

    this.el.addEventListener("keydown", this._handleDocumentKeyDown, true);
    this.el.addEventListener("blur", this._handleDocumentBlur, true);
    this.el.addEventListener("focus", this._handleDocumentFocus, true);
    this.el.addEventListener(EVENTS.SELECT, this._handleOptionSelected, true);
  },

  updated() {
    this.multiple = this.el.hasAttribute(selectEvent);
  },

  destroyed() {
    this.el.removeEventListener("keydown", this._handleDocumentKeyDown, true);
    this.el.removeEventListener("blur", this._handleDocumentBlur, true);
    this.el.removeEventListener("focus", this._handleDocumentFocus, true);
    this.el.removeEventListener(
      EVENTS.SELECT,
      this._handleOptionSelected,
      true
    );
  },

  handleDocumentKeyDown(event) {
    const { metaKey, ctrlKey, shiftKey, key } = event;
    const cmd = isMacOS() ? metaKey : ctrlKey;

    const focusedOption = this.el.querySelector("[data-focused=true]");
    let nextFocusedOption;

    if (key == " " || key == "Enter") {
      const el = focusedOption;
      this.liveSocket.execJS(el, el.getAttribute("data-select"));
      return;
    }

    if (key == "Home") {
      nextFocusedOption = this.getFirstAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        let el = focusedOption;
        const callback = (el) => {
          this.liveSocket.execJS(el, el.getAttribute("data-select"));
        };
        this.iterateOverSiblings(el, "previous", callback);
        this.liveSocket.execJS(el, el.getAttribute("data-select"));
      }
    } else if (key == "End") {
      nextFocusedOption = this.getLastAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        let el = focusedOption;
        const callback = (el) => {
          this.liveSocket.execJS(el, el.getAttribute("data-select"));
        };
        this.iterateOverSiblings(el, "next", callback);
        this.liveSocket.execJS(el, el.getAttribute("data-select"));
      }
    } else if (key == "ArrowDown") {
      nextFocusedOption = focusedOption.nextElementSibling;
    } else if (key == "ArrowUp") {
      nextFocusedOption = focusedOption.previousElementSibling;
    } else {
      return;
    }

    this.updateFocusedOption(nextFocusedOption || focusedOption);
  },

  handleDocumentBlur(event) {
    this.removeFocusedOption();
  },

  handleDocumentFocus(event) {
    // focus is set on the first returned selected option or the first option
    // not disabled
    const nextOption =
      this.el.querySelector("[aria-selected=true]") ||
      this.getFirstAvailableOption();

    if (this.mouseDown) return;

    this.updateFocusedOption(nextOption);
    this.updateFocusVisibleOption(nextOption);
  },

  handleOptionSelected(event) {
    const el = event.target;
    const isSelected = el.getAttribute("aria-selected") == "true";

    this.selectOption(el, !isSelected);
    this.updateFocusedOption(event.target);
  },

  getFirstAvailableOption() {
    return this.el.querySelector("[role=option]:not([disabled])");
  },

  getLastAvailableOption() {
    options = this.el.querySelectorAll("[role=option]:not([disabled])");
    return options[options.length - 1];
  },

  updateFocusedOption(el) {
    this.removeFocusedOption();
    this.el.setAttribute("aria-activedescendant", el?.id);
    el?.setAttribute("data-focused", true);
  },

  removeFocusedOption() {
    const el = this.el.querySelector("[data-focused=true]");
    el?.removeAttribute("data-focused");
    this.el.setAttribute("aria-activedescendant", "");
  },

  updateFocusVisibleOption(el) {
    this.removeFocusVisibleOption();
    el?.setAttribute("data-focus-visible", true);
  },

  removeFocusVisibleOption() {
    const el = this.el.querySelector("[data-focus-visible=true]");
    el?.removeAttribute("data-focus-visible");
  },

  selectOption(el, isSelected) {
    if (!this.multiple && isSelected == true) {
      for (let option of this.el.querySelectorAll("[aria-selected=true]")) {
        option.setAttribute("aria-selected", false);
        option.setAttribute("data-selected", false);
      }
    }

    if (!this.multiple) {
      this.el.dispatchEvent(new Event(EVENTS.UPDATED, { bubbles: true }));
    }

    el.setAttribute("aria-selected", isSelected);
    el.setAttribute("data-selected", isSelected);
  },

  iterateOverSiblings(el, direction, callback) {
    const key =
      direction == "next" ? "nextElementSibling" : "previousElementSibling";

    while (el[key] != null) {
      el = el[key];
      callback(el);
    }
  },
};

export { Listbox, EVENTS };
