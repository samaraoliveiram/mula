# Mula

The Phoenix LiveView headless component library.

## Development

The project uses Elixir umbrella apps to make the library development easier:
- `apps/mula`: the actual `:mula` package hosted on hex.pm
- `apps/mula_dev`: a LiveView demo application to test and develop the library

### Getting started

Setup `mula_dev` phoenix project:

```shell
cd apps/mula_dev
mix setup
```

Start the server from root dir or `mula_dev` app:

``` shell
mix phx.server
```
