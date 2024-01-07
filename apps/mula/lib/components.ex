defmodule Mula.Components do
  @moduledoc """
  Provides core UI components.
  """

  use Phoenix.Component

  alias Phoenix.LiveView.JS
  # import MulaWeb.Gettext

  @doc """
  """
  slot :item do
    attr(:class, :string)
  end

  # attr :selected_keys, :list, default: []
  # attr :on_selection_change, :any
  attr(:id, :string, required: true)
  attr(:multiple, :boolean, default: false)
  attr(:rest, :global, doc: "the arbitrary HTML attributes to add to the select container")
  # todo: add feat to give an option id to be selected on focus

  def listbox(assigns) do
    ~H"""
    <div
      id={@id}
      role="listbox"
      aria-activedescendant=""
      aria-multiselectable={@multiple}
      tabindex="0"
      phx-hook="Listbox"
      {@rest}
    >
      <div
        :for={{item, i} <- Enum.with_index(@item)}
        role="option"
        id={item[:id] || "#{@id}-#{i}"}
        class={item[:class]}
        phx-click={JS.dispatch("mula:listbox:clicked")}
        aria-selected="false"
      >
        <%= render_slot(item) %>
      </div>
    </div>
    """
  end

  attr(:id, :string, required: true)
  attr(:rest, :global, doc: "the arbitrary HTML attributes to add to the select container")
  slot(:inner_block, doc: "the optional inner block that renders the")

  @spec select(map()) :: Phoenix.LiveView.Rendered.t()
  def select(assigns) do
    ~H"""
    <div
      id={@id}
      data-toggle-popover={JS.toggle(to: "##{@id} .mula-popover")}
      phx-click-away={JS.hide(to: "##{@id} .mula-popover")}
      phx-hook="Select"
      {@rest}
    >
      <%= render_slot(@inner_block, %{
        open: %{"phx-click" => JS.exec("data-toggle-popover", to: "##{@id}")}
      }) %>
    </div>
    """
  end

  attr(:rest, :global, doc: "the arbitrary HTML attributes to add to the select container")
  slot(:inner_block, doc: "the optional inner block that renders the")

  def popover(assigns) do
    ~H"""
    <div data-hidden hidden {@rest} class="mula-popover">
      <%= render_slot(@inner_block) %>
    </div>
    """
  end
end
