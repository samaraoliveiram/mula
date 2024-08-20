import { EVENTS as LISTBOX_EVTS } from "./listbox"

const EVENTS = {
  CLICK_AWAY: "mula:select:click-away"
}

const select = {
  mounted() {
    this.phxOnChange = this.el.getAttribute("data-on-change");
    this.multiple = this.el.getAttribute("data-multiple") == "true";
    this.listbox = this.el.querySelector("[role='listbox']");
    this.trigger = this.el.querySelector("[aria-haspopover='listbox']");

    this.el.addEventListener(EVENTS.CLICK_AWAY, () => this.close());

    this.el.addEventListener(LISTBOX_EVTS.UPDATED, (event) => {
      if (this.multiple != true) {
        this.close()
        this.focusTrigger()
      }

      if (this.phxOnChange) {
        this.pushEvent(this.phxOnChange, { value: event.detail })
      }
    });

    // Listbox Events
    this.listbox.addEventListener("blur", () => this.close());

    // Trigger Events
    this.trigger.addEventListener("click", (e) => this.activate(e));
  },
  focusTrigger() {
    this.trigger.focus();
  },
  activate(event) {
    this.execJS("data-toggle-popover");
    // Without requesting frame, popover would be hidden and therefore listbox unfocusable
    requestAnimationFrame(() => {
      const isKeyboardEvent = event.screenX == 0 && event.screenY == 0;
      // focusVisible should only be shown on keyboard events
      this.listbox.focusChild({ focusVisible: isKeyboardEvent });
      // Tab-ability must be restored on close
      this.trigger.setAttribute("tabindex", -1);
    });
  },
  close() {
    this.execJS("data-close-popover");
    this.trigger.setAttribute("tabindex", 0);
  },
  execJS(attr, el = this.el) {
    this.liveSocket.execJS(el, el.getAttribute(attr));
  }
};

export default select;
