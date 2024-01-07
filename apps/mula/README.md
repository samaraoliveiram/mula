# Mula

[![Hex.pm](https://img.shields.io/hexpm/v/mula.svg)](https://hex.pm/packages/mula) [![Documentation](https://img.shields.io/badge/documentation-gray)](https://hexdocs.pm/mula)

The headless component library tailored for Phoenix LiveView

## Installation

The package can be installed by adding `mula` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:mula, "~> 0.1.0"}
  ]
end
```

### Installing the javascript

Inside the `assets` directory of your phoenix project run:

``` shell
npm install ../deps/mula
```

After which you will be able to import `mula` like this:

```javascript
import Mula from "mula"
```
