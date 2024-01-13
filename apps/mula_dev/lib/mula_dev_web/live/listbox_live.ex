defmodule MulaDevWeb.ListboxLive do
  use MulaDevWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <div>
        <h1>Single select</h1>
        <.listbox id="single" class="bg-gray-300" aria-label="Favorite number">
          <:item
            :for={item <- [1, 2, 3]}
            class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500"
          >
            <%= item %>
          </:item>
        </.listbox>
      </div>

      <div>
        <h1>Multiple Select</h1>
        <.listbox id="multiple" multiple class="bg-gray-300" aria-label="Favorite animal">
          <:item class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500">
            Dog
          </:item>
          <:item class="data-[selected=true]:bg-blue-500 data-[focused]:outline-dashed outline-pink-500">
            Cat
          </:item>
        </.listbox>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, selected_keys: [1])}
  end
end
