defmodule Mula.MixProject do
  use Mix.Project

  @app :mula
  @version "0.1.0"
  @source_url "https://github.com/samaraoliveiram/mula"

  def project do
    [
      app: @app,
      version: @version,
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      description: "The Phoenix LiveView headless component library",
      package: package(),
      deps: deps(),
      docs: docs(),
      aliases: aliases()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  def package do
    [
      maintainers: ["Samara Motta", "Giovanni Francischelli"],
      licenses: ["MIT"],
      links: %{"Github" => @source_url},
      files:
        ~w(assets/js lib priv) ++
          ~w(mix.exs package.json README.md LICENSE.md)
    ]
  end

  defp deps do
    [
      {:esbuild, "~> 0.8", only: :dev},
      {:ex_doc, ">= 0.0.0", only: [:dev], runtime: false}
    ]
  end

  defp docs do
    [
      main: "readme",
      homepage_url: @source_url,
      source_url_pattern:
        "#{@source_url}/blob/#{@app}@v#{@version}/apps/#{@app}/%{path}#L%{line}",
      extras: [
        "README.md"
      ]
    ]
  end

  defp aliases do
    [
      "assets.build": ["esbuild module", "esbuild cdn", "esbuild cdn_min", "esbuild main"],
      "assets.watch": ["esbuild module --watch"]
    ]
  end
end
