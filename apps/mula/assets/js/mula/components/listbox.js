const listbox = {
  mounted() {
    this.multiple = this.el.hasAttribute("aria-multiselectable");

    this.el.addEventListener("blur", (event) => {
      this.removeDataFocused();
    });

    this.el.addEventListener("focus", (event) => {
      if (!this.multiple) {
        const nextFocusedEl =
          this.el.querySelector("[aria-selected=true]") ||
          this.el.querySelector("[role=option]:not([disabled])");

        this.updateDataFocused(nextFocusedEl);
      }
    });

    this.el.addEventListener("mula:listbox:clicked", (event) => {
      this.toggleOption(event.target);
      this.updateDataFocused(event.target);
    });
  },

  removeDataFocused() {
    for (let option of this.el.querySelectorAll("[data-focused=true]")) {
      option.removeAttribute("data-focused");
    }
    this.el.setAttribute("aria-activedescendant", "");
  },

  updateDataFocused(el) {
    this.removeDataFocused();
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

  toggleOption(el) {
    const isSelected = el.getAttribute("aria-selected") == "true";
    this.selectOption(el, !isSelected);
  },
};

export default listbox;
