import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :mula_dev, MulaDev.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "mula_dev_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :mula_dev_web, MulaDevWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "v0Tcmd54CoFu4gx0AZfk8WH9QC9gHRcQi+6yw5efn0Krb9hJ3B2ImlNkIkhDG9iO",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
