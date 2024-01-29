defmodule MulaDevWeb.MeterLive do
  use MulaDevWeb, :live_view

  def render(assigns) do
    intervals = [
      %{value: 10, min_value: 10, max_value: 20},
      %{value: 25},
      %{value: 1.5, min_value: 1, max_value: 2},
      %{value: 75},
      %{
        value: 175,
        min_value: 35,
        max_value: 175,
        value_text_formatter: fn text -> "Custom label for #{text} percentage" end
      }
    ]

    assigns = assign(assigns, :intervals, intervals)

    ~H"""
    <div>
      <h1>Meter Component</h1>
      <br />
      <hr />
      <br />
      <%= for interval <- @intervals do %>
        <p>value: <%= interval[:value] %></p>
        <p :if={not is_nil(interval[:min_value])}>min value: <%= interval[:min_value] %></p>
        <p :if={not is_nil(interval[:max_value])}>max value: <%= interval[:max_value] %></p>
        <p :if={not is_nil(interval[:value_text_formatter])}>custom text formatter: yes</p>
        <br />
        <div :if={not is_nil(interval[:min_value]) and not is_nil(interval[:max_value])}>
          <.meter
            :let={meter}
            value={interval[:value]}
            min_value={interval[:min_value]}
            max_value={interval[:max_value]}
            value_text_formatter={interval[:value_text_formatter]}
          >
            <div class="flex flex-row gap-4">
              <.label><%= meter.value_text %></.label>
              <div class="bg-gray-200 w-60 h-6 p-px border border-black">
                <div class="bg-green-500 h-full" style={"width: #{meter.percentage}%; !"}></div>
              </div>
            </div>
          </.meter>
        </div>
        <div :if={is_nil(interval[:min_value]) or is_nil(interval[:max_value])}>
          <.meter :let={meter} value={interval[:value]}>
            <div class="flex flex-row gap-4">
              <.label><%= meter.value_text %></.label>
              <div class="bg-gray-200 w-60 h-6 p-px border border-black">
                <div class="bg-green-500 h-full" style={"width: #{meter.percentage}%; !"}></div>
              </div>
            </div>
          </.meter>
        </div>
        <br />
        <hr />
        <br />
      <% end %>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end
