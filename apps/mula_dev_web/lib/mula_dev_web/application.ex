defmodule MulaDevWeb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MulaDevWeb.Telemetry,
      # Start a worker by calling: MulaDevWeb.Worker.start_link(arg)
      # {MulaDevWeb.Worker, arg},
      # Start to serve requests, typically the last entry
      MulaDevWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MulaDevWeb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MulaDevWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
