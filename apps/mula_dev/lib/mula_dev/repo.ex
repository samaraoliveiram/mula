defmodule MulaDev.Repo do
  use Ecto.Repo,
    otp_app: :mula_dev,
    adapter: Ecto.Adapters.Postgres
end
