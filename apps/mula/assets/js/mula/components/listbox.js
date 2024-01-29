const EVENTS = {
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
    this._handleClick = this.handleClick.bind(this);

    this.el.addEventListener("keydown", this._handleDocumentKeyDown, true);
    this.el.addEventListener("blur", this._handleDocumentBlur, true);
    this.el.addEventListener("focus", this._handleDocumentFocus, true);
    this.el.addEventListener("mouseup", this._handleClick, true);
    // Workaround to detect if focus comes from mouse or keyboard
    this.el.addEventListener("mousedown", () => this.mouseDown = true)
    this.el.addEventListener("mouseup", () => this.mouseDown = false)
  },

  updated() {
    this.multiple = this.el.hasAttribute(selectEvent);
  },

  destroyed() {
    this.el.removeEventListener("keydown", this._handleDocumentKeyDown, true);
    this.el.removeEventListener("blur", this._handleDocumentBlur, true);
    this.el.removeEventListener("focus", this._handleDocumentFocus, true);
  },

  handleDocumentKeyDown(event) {
    const { metaKey, ctrlKey, shiftKey, key } = event;
    const cmd = isMacOS() ? metaKey : ctrlKey;

    const focusedOption = this.el.querySelector("[data-focused=true]");
    let nextFocusedOption;

    if (key == " " || key == "Enter") {
      this.selectOption(focusedOption);
      return;
    }

    if (key == "Home") {
      nextFocusedOption = this.getFirstAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        this.iterateOverSiblings(focusedOption, "previous", this.selectOption.bind(this));
        this.selectOption(focusedOption)
      }
    } else if (key == "End") {
      nextFocusedOption = this.getLastAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        this.iterateOverSiblings(focusedOption, "next", this.selectOption.bind(this));
        this.selectOption(focusedOption)
      }
    } else if (key == "ArrowDown") {
      nextFocusedOption = focusedOption.nextElementSibling;
    } else if (key == "ArrowUp") {
      nextFocusedOption = focusedOption.previousElementSibling;
    } else {
      return;
    }

    this.updateFocusedOption(nextFocusedOption || focusedOption);
    this.updateFocusVisibleOption(nextFocusedOption || focusedOption);
  },

  handleDocumentBlur(event) {
    this.removeFocusedOption();
    this.removeFocusVisibleOption();
  },

  handleDocumentFocus(event) {
    // focus is set on the first returned selected option or the first option
    // not disabled
    const nextOption =
      this.el.querySelector("[aria-selected=true]") ||
      this.getFirstAvailableOption();

    this.updateFocusedOption(nextOption);

    if (!this.mouseDown) {
      // Only keyboard focus should update focus visible
      this.updateFocusVisibleOption(nextOption);
    }
  },

  handleOptionSelected(event) {
    this.selectOption(event.target);
  },

  handleClick(event) {
    this.selectOption(event.target)
    this.removeFocusVisibleOption();
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
    this.el.querySelector("[data-focus-visible='true']")
      ?.removeAttribute("data-focus-visible");
  },

  selectOption(el) {
    const isUnselected = el.getAttribute("aria-selected") != "true";

    if (!this.multiple && isUnselected == true) {
      for (let option of this.el.querySelectorAll("[aria-selected=true]")) {
        option.setAttribute("aria-selected", false);
        option.setAttribute("data-selected", false);
      }
    }

    if (!this.multiple) {
      this.el.dispatchEvent(new Event(EVENTS.UPDATED, { bubbles: true }));
    }

    el.setAttribute("aria-selected", isUnselected);
    el.setAttribute("data-selected", isUnselected);

    this.updateFocusedOption(el);
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
