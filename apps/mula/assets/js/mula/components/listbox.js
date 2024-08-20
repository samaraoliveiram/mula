const EVENTS = {
  UPDATED: "mula:listbox:updated",
};

const isMacOS = () => {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
};

const Listbox = {
  mounted() {
    const self = this;

    this.multiple = this.el.hasAttribute("aria-multiselectable");
    this.selectedOption = null;

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

    this.selectOptionsFromProps()

    // HTMLElement Interoperability Extension Callbacks --------------------------
    // 
    // The `listbox` element is queried by higher-level components like `select`.
    
    // This function allows a parent element to control how to focus listbox items
    this.el.focusChild = function(opts = {}) {
      self.focusVisible = opts.focusVisible
      self.el.focus();
    }
  },

  updated() {
    this.selectOptionsFromProps()
    // this.multiple = this.el.hasAttribute(selectEvent);
  },

  destroyed() {
    this.el.removeEventListener("keydown", this._handleDocumentKeyDown, true);
    this.el.removeEventListener("blur", this._handleDocumentBlur, true);
    this.el.removeEventListener("focus", this._handleDocumentFocus, true);
    this.el.removeEventListener("mouseup", this._handleClick, true);
    this.el.removeEventListener("mousedown", () => (this.mouseDown = true));
    this.el.removeEventListener("mouseup", () => (this.mouseDown = false));
  },

  selectOptionsFromProps() {
    const selectedValue = this.el.getAttribute("data-selected-value");

    if (selectedValue) {
      const optionToSelect = this.el.querySelector(`[role='option'][data-value='${selectedValue}']`)

      if (!optionToSelect) {
        console.warn(`Option with value ${selectedValue} does not exist`)
        return;
      }

      optionToSelect.setAttribute("aria-selected", true);
      optionToSelect.setAttribute("data-selected", true);
    }
  },

  handleDocumentKeyDown(event) {
    const { metaKey, ctrlKey, shiftKey, key } = event;
    const cmd = isMacOS() ? metaKey : ctrlKey;

    const focusedOption = this.el.querySelector("[data-focused=true]");
    const selectedOption = this.selectedOption;
    let nextFocusedOption;

    if (key == " " || key == "Enter") {
      this.selectOption(focusedOption);

      if (shiftKey && selectedOption && selectedOption != focusedOption) {
        this.selectBetweenChilds(this.el, selectedOption, focusedOption);
      }
    } else if (key == "Home") {
      nextFocusedOption = this.getFirstAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        this.selectOption(focusedOption);
        this.selectOption(nextFocusedOption);
        this.selectBetweenChilds(this.el, nextFocusedOption, focusedOption);
      }
    } else if (key == "End") {
      nextFocusedOption = this.getLastAvailableOption();

      if (cmd && shiftKey && this.multiple) {
        this.selectOption(focusedOption);
        this.selectOption(nextFocusedOption);
        this.selectBetweenChilds(this.el, nextFocusedOption, focusedOption);
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
    this.selectedOption = null;
  },

  handleDocumentFocus(event) {
    // focus is set on the first returned selected option or the first option
    // not disabled
    const nextOption =
      this.el.querySelector("[aria-selected=true]") ||
      this.getFirstAvailableOption();

    this.updateFocusedOption(nextOption);


    if (!this.mouseDown && !this.embedded && this.focusVisible != false) {
      // Only keyboard focus should update focus visible
      this.updateFocusVisibleOption(nextOption);
      this.focusVisible = true
    }
  },

  handleOptionSelected(event) {
    this.selectOption(event.target);
  },

  handleClick(event) {
    this.selectOption(event.target);
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
    this.el
      .querySelector("[data-focus-visible='true']")
      ?.removeAttribute("data-focus-visible");
  },

  selectOption(el) {
    this.selectedOption = el;
    const isUnselected = el.getAttribute("aria-selected") != "true";

    if (!this.multiple && isUnselected == true) {
      for (let option of this.el.querySelectorAll("[aria-selected=true]")) {
        option.setAttribute("aria-selected", false);
        option.setAttribute("data-selected", false);
      }
    }

    el.setAttribute("aria-selected", isUnselected);
    el.setAttribute("data-selected", isUnselected);

    this.updateFocusedOption(el);

    if (!this.multiple) {
      const value = isUnselected ? el.getAttribute("data-value") : null
      this.el.dispatchEvent(new CustomEvent(EVENTS.UPDATED, { bubbles: true, detail: value }));
    }
  },

  selectBetweenChilds(parent, child1, child2) {
    let between = false;

    for (let el of parent.children) {
      if (el == child1 || el == child2) {
        between = !between;
        continue;
      }

      if (between) {
        this.selectOption(el);
      }
    }
  },
};

export { Listbox, EVENTS };
