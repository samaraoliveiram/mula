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
        aria-selected="false"
        data-select={JS.dispatch("mula:listbox:selected")}
        phx-click={JS.exec("data-select")}
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

  attr(:value, :float,
    required: true,
    doc:
      "the value represented on the meter, must be between min_value and max_value, if min_value and max_value are not passed, value will be a plain percentage"
  )

  attr(:max_value, :float,
    default: 100.0,
    doc:
      "the maximun value of the interval represented on the meter, must be greater than min_value, must be greater than or equal value"
  )

  attr(:min_value, :float,
    default: 0.0,
    doc:
      "the minimun value of the interval represented on the meter, must be lesser than max_value, must be lesser than or equal value"
  )

  attr(:value_text_formatter, :any,
    default: nil,
    doc:
      "a function that receives the calculated percentage and returns a string, it's used to set the aria-valuetext and the value_text returned"
  )

  slot(:inner_block, doc: "the optional inner block that renders the")

  def meter(assigns) do
    %{
      value: value,
      max_value: max_value,
      min_value: min_value,
      value_text_formatter: value_text_formatter
    } = assigns

    unless max_value > min_value do
      raise ArgumentError,
        message: "[Mula.Components.meter/1] max_value must be greater than min_value"
    end

    unless max_value >= value do
      raise ArgumentError,
        message: "[Mula.Components.meter/1] max_value must be greater than or equal to value"
    end

    unless value >= min_value do
      raise ArgumentError,
        message: "[Mula.Components.meter/1] min_value must be lesser than or equal to value"
    end

    percentage = (value - min_value) / (max_value - min_value) * 100

    value_text =
      unless is_nil(value_text_formatter),
        do: apply(value_text_formatter, [percentage]),
        else: "#{percentage}%"

    assigns =
      assign(assigns, %{
        value: value,
        min_value: min_value,
        max_value: max_value,
        percentage: percentage,
        value_text: value_text
      })

    ~H"""
    <div role="meter" aria-valuenow={@value} aria-valuemin={@min_value} aria-valuemax={@max_value} aria-valuetext={@value_text}>
      <%= render_slot(@inner_block, %{min_value: @min_value, max_value: @max_value, percentage: @percentage, value_text: @value_text}) %>
    </div>
    """
  end

  defp default_value_text_formatter(value_text), do: "#{value_text}%"
end
