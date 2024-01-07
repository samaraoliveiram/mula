# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :mula_dev,
  ecto_repos: [MulaDev.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :mula_dev, MulaDevWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [html: MulaDevWeb.ErrorHTML, json: MulaDevWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: MulaDev.PubSub,
  live_view: [signing_salt: "UstLNTnf"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :mula_dev, MulaDev.Mailer, adapter: Swoosh.Adapters.Local

esbuild = fn args ->
  [
    args: ~w(./js/mula --bundle) ++ args,
    cd: Path.expand("../apps/mula/assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]
end

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  module: esbuild.(~w(--format=esm --sourcemap --outfile=../priv/static/mula.esm.js)),
  main: esbuild.(~w(--format=cjs --sourcemap --outfile=../priv/static/mula.cjs.js)),
  cdn:
    esbuild.(
      ~w(--format=iife --target=es2016 --global-name=Mula --outfile=../priv/static/mula.js)
    ),
  cdn_min:
    esbuild.(
      ~w(--format=iife --target=es2016 --global-name=Mula --minify --outfile=../priv/static/mula.min.js)
    ),
  # Development app :mula_dev
  mula_dev: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../apps/mula_dev/assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.3.2",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../apps/mula_dev/assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"

