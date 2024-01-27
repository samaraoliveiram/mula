defmodule MulaDevWeb.ListboxLive do
  use MulaDevWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <div>
        <h1>Single select</h1>
        <.listbox id="single" class="bg-gray-300" aria-label="Favorite color">
          <:item
            :for={color <- @colors}
            class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500"
          >
            <%= color %>
          </:item>
        </.listbox>
      </div>

      <div>
        <h1>Multiple Select</h1>
        <.listbox id="multiple" multiple class="bg-gray-300" aria-label="Favorite color">
          <:item class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500">
            Green
          </:item>
          <:item
            :for={color <- @colors}
            class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500"
          >
            <%= color %>
          </:item>
        </.listbox>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, colors: ["Black", "Blue", "Red"])}
  end
end
