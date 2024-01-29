defmodule MulaDevWeb.SelectLive do
  use MulaDevWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <div>
        <h1>Single select</h1>
        <.select :let={actions} id="single_select">
          <.button {actions.open}>Botao</.button>
          <.popover>
            <.listbox id="single" aria-label="Favorite number" class="bg-green-500">
              <:option :for={item <- [1, 2, 3]} class="aria-selected:bg-blue-500">
                <%= item %>
              </:option>
            </.listbox>
          </.popover>
        </.select>
      </div>

      <div>
        <h1>Multiple Select</h1>
        <.select :let={actions} id="multiple_select" class="flex">
          <.popover>
            <.listbox id="multiple" aria-label="Favorite animal" multiple class="bg-red-500">
              <:option class="aria-selected:bg-blue-500">Dog</:option>
              <:option class="aria-selected:bg-blue-500">Cat</:option>
              <:option class="aria-selected:bg-blue-500">Wombat</:option>
            </.listbox>
          </.popover>
          <.button {actions.open}>Botao</.button>
        </.select>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, selected_keys: [1])}
  end
end
