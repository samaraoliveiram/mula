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

  attr(:id, :string, required: true)
  attr :multiple, :boolean, default: false
  attr(:label, :string, required: true)
  attr(:options, :list, required: true)
  attr(:rest, :global)

  defp my_listbox(assigns) do
    ~H"""
    <.listbox
      id={@id}
      multiple={@multiple}
      aria-label={@label}
      class="flex flex-col gap-1 outline-none rounded-md border border-slate-400 p-2"
    >
      <:option
        :for={option <- @options}
        class={[
          "group/option relative flex justify-between items-center",
          "w-full cursor-default select-none outline-none",
          "cursor-pointer rounded-md p-2 text-slate-800",
          "data-[focus-visible]:outline-violet-600 outline-offset-[-2px]",
          "data-[selected='true']:bg-green-100"
        ]}
      >
        <span><%= option %></span>
        <.icon
          name="hero-check-circle-solid"
          class="text-green-500 h-6 w-6 group-data-[selected='true']/option:block hidden"
        />
      </:option>
    </.listbox>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, colors: ["Black", "Blue", "Red", "White"])}
  end
end
