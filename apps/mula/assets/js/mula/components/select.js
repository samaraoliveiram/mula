const select = {
  mounted() {
    this.el.addEventListener("mula:listbox:selection", (event) => {
      this.liveSocket.execJS(
        this.el,
        this.el.getAttribute("data-toggle-popover")
      );
    });
  },
};

export default select;
