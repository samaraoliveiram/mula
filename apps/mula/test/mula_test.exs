defmodule MulaTest do
  use ExUnit.Case
  doctest Mula

  test "greets the world" do
    assert Mula.hello() == :world
  end
end
