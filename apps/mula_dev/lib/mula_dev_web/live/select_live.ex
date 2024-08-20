defmodule MulaDevWeb.SelectLive do
  use MulaDevWeb, :live_view

  @options ["Red", "Green", "Blue"]

  def render(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <div>
        <.my_select
          id="single-select"
          label="Colors"
          options={@options}
          value={@selection}
          on_change="selection"
        />
      </div>
      <div>
        <.my_select
          id="multi-select"
          label="Multiple Colors"
          options={@options}
          value={@multi_selection}
          on_change="multi-selection"
          multiple
        />
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, options: @options, selection: nil, multi_selection: [])}
  end

  def handle_event("selection", params, socket) do
    {:noreply, assign(socket, selection: params["value"])}
  end

  def handle_event("multi-selection", params, socket) do
    {:noreply, assign(socket, multi_selection: params["value"])}
  end
end
