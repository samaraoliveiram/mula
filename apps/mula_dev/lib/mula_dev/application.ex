defmodule MulaDev.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MulaDev.Repo,
      {DNSCluster, query: Application.get_env(:mula_dev, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: MulaDev.PubSub}
      # Start a worker by calling: MulaDev.Worker.start_link(arg)
      # {MulaDev.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: MulaDev.Supervisor)
  end
end
