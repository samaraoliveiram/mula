defmodule MulaDevWeb.ListboxLive do
  use MulaDevWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <div>
        <h1 class="text-2xl text-slate-700 text-bold mb-4">Single select</h1>
        <.my_listbox options={@colors} label="Favorite color" id="single" />
      </div>

      <div>
        <h1 class="text-2xl text-slate-700 text-bold mb-4 mt-8">Multiple select</h1>
        <.my_listbox multiple options={@colors} label="Favorite colors" id="multi" />
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, colors: ["Black", "Blue", "Red", "White"])}
  end
end
