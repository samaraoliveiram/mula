defmodule Mula.Components do
  @moduledoc """
  Provides core UI components.
  """

  use Phoenix.Component

  alias Phoenix.LiveView.JS

  @doc ~S'''
  Presents a list of options and allows users to select one or optionally more
  of them.

  ## Styling

  The component can be fully styled using any CSS flavor. Additionally it provides
  utilities to style with TailwindCSS.

  The following CSS selectors can be used to style:

    * `.mula-listbox` - the root div with `[role='listbox']`
    * `.mula-listbox_option` - the div with `[role='option']`
    * `.mula-listbox_option[data-focused]` - when it receives keyboard focus
    * `.mula-listbox_option[data-selected]` - when selection is active

  ## Keyboard navigation

  The component implements accessible keyboard navigation following [WAI-ARIA
  Authoring Practices Guide - Listbox
  Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/):

    * Selection toggle with `Space` and `Enter`
    * Focus navigation with `ArrowUp`, `ArrowDown`, `Esc`, `Home`
    * Multiple selection with `Shift`, `Ctrl`, `Meta` and focus navigation
    * Typeahead: focus moves to the option that the name starts with characters
      typed by user

  ## Implementing the styled listbox

  The `listbox/1` component should be used to implement your own styled listbox:

  Suppose you are writting the `my_listbox` component:

  ```heex
  <.listbox id={@id} multiple={@multiple}>
    <.listbox_section :for={section <- @sections} class="...">
      <:header class="..."><%= section.label %></:header>
      <.listbox_option :for={option <- section.options} id={option.id} class="...">
        <%= option.label %>
      </.listbox_option>
    <:section>

    <!-- alternative API without listbox sections -->

    <.listbox_option for={option <- @option} id={option.id} class={option.class}>
      <%= item.label %>
    </.listbox_option>
  </.listbox>
  ```

  Use you own styled listbox accross your application:

  ```heex
  <.my_listbox>
    <:section label="Veggies" options={@veggies} />
    <:section label="Pantry Staples" options={@pantry_staples} />
  </.my_listbox>
  ```

  ## Sections

  ## Option labels

  ```heex
  <.listbox id={@id} multiple={@multiple}>
    <.listbox_option id="read">
      <:label>Read</:label>
      <:description>Read only</:description>
    </.listbox_option>
    <.listbox_option id="write">
      <:label>Write</:label>
      <:description>Read and write only</:description>
    </.listbox_option>
     <.listbox_option id="admin">
      <:label>Admin</:label>
      <:description>Full access</:description>
    </.listbox_option>
  <.listbox>
  ```

  ## JavaScript custom events

  This widget emits the following events for interoperability with other components JavaScript:

    * `mula:listbox:updated` - event `detail` contains the list of selected option ids
    * `mula:listbox:select` - trigger to an option selection behaviour
  '''
  slot :option, doc: "Slot for the listbox option" do
    attr :id, :any, doc: "The option id"
    attr :value, :any, doc: "The option value"
    attr :class, :any
  end

  attr :id, :string, required: true
  attr :selected_value, :any, default: nil
  attr :multiple, :boolean, default: false
  attr :rest, :global, doc: "the arbitrary HTML attributes to add to the select container"
  # todo: add feat to give an option id to be selected on focus

  def listbox(assigns) do
    ~H"""
    <div
      id={@id}
      role="listbox"
      data-selected-value={@selected_value}
      aria-activedescendant=""
      aria-multiselectable={@multiple}
      tabindex="0"
      phx-hook="Listbox"
      {@rest}
    >
      <div
        :for={{option, i} <- Enum.with_index(@option)}
        role="option"
        id={option[:id] || "#{@id}-#{i}"}
        data-value={option[:value]}
        class={option[:class]}
        aria-selected="false"
      >
        <%= render_slot(option) %>
      </div>
    </div>
    """
  end

  @doc ~S'''
  Presents collapsible list of options for user selection.

  ```heex
  <.select :let={select}>
    <label {select.label_attrs}>My Label</label>
    <button {select.click_trigger_attrs}>
      <%= select.value || "Select a fruit" %>
    </button>
    <.popover>
      <.listbox owner={select}>
        <.listbox_option :for={fruit <- @fruits} id={fruit}>
          <%= fruit.name %>
        </.listbox_option>
      </.listbox>
    </.popover>
  </.select>
  ```

  Generates:

  ```html
  <div class="mula-listbox">
    <label id="label-id">Select a fruit</label>

    <button aria-labelledby="label-id" aria-haspopup="listbox" aria-expanded="false"/>

    <div class="mula-popover" hidden>
      <div class="mula-listbox" aria-role="listbox" aria-lebelledby="label-id">
        ...
      </div>
    </div>
  </div>
  ```
  '''

  attr :id, :string, required: true
  attr :multiple, :boolean, default: false
  attr :value, :any
  attr :on_change, :string, default: ""
  attr :rest, :global, doc: "the arbitrary HTML attributes to add to the select container"
  slot :inner_block, doc: "the optional inner block that renders the"

  @spec select(map()) :: Phoenix.LiveView.Rendered.t()
  def select(assigns) do
    assigns =
      assign(assigns, label_id: "#{assigns.id}-label", listbox_id: "#{assigns.id}-listbox")

    ~H"""
    <div
      id={@id}
      data-on-change={@on_change}
      data-toggle-popover={JS.toggle(to: "##{@id} .mula-popover")}
      data-close-popover={JS.hide(to: "##{@id} .mula-popover")}
      phx-click-away={JS.dispatch("mula:select:click-away")}
      data-multiple={@multiple}
      phx-hook="Select"
      {@rest}
    >
      <%= render_slot(@inner_block, %{
        trigger_attrs: %{"aria-haspopover": "listbox", "aria-labelledby": @label_id},
        listbox_attrs: %{id: @listbox_id, "aria-labelledby": @label_id, multiple: @multiple},
        label_attrs: %{id: @label_id}
      }) %>
    </div>
    """
  end

  @doc ~S'''
  Presents content on a window overlayed relative to the open/close trigger.
  '''
  attr :class, :string, default: ""
  attr :rest, :global, doc: "the arbitrary HTML attributes to add to the select container"
  slot :inner_block, doc: "the optional inner block that renders the"

  def popover(assigns) do
    ~H"""
    <div data-hidden hidden class={["mula-popover", @class]} {@rest}>
      <%= render_slot(@inner_block) %>
    </div>
    """
  end
end
