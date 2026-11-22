import { test } from "node:test";
import assert from "node:assert/strict";
import { filterByName, formatBody, idFromUrl, isPokemon, isPokemonPage, pageUrl, titleCase } from "./pokemon.js";

test("idFromUrl reads the trailing id", () => {
  assert.equal(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/"), 25);
  assert.equal(idFromUrl("https://pokeapi.co/api/v2/pokemon/"), null);
});

test("pageUrl uses limit and offset", () => {
  assert.match(pageUrl(2), /limit=24&offset=48$/);
});

test("filterByName and titleCase", () => {
  const items = [{ name: "pikachu", url: "" }, { name: "mr-mime", url: "" }];
  assert.equal(filterByName(items, " PIKA").length, 1);
  assert.equal(filterByName(items, "mime").length, 1);
  assert.equal(titleCase("mr-mime"), "Mr Mime");
});

test("formatBody converts units", () => {
  assert.equal(formatBody({ height: 4, weight: 60 }), "0.4 m · 6.0 kg");
});

test("guards", () => {
  assert.equal(isPokemonPage({ count: 1, results: [{ name: "a", url: "b" }] }), true);
  assert.equal(isPokemonPage({ results: [] }), false);
  const pokemon = {
    id: 25, name: "pikachu", height: 4, weight: 60,
    types: [{ slot: 1, type: { name: "electric", url: "" } }],
    stats: [{ base_stat: 35, effort: 0, stat: { name: "hp", url: "" } }],
    sprites: { front_default: null },
  };
  assert.equal(isPokemon(pokemon), true);
  assert.equal(isPokemon({ ...pokemon, sprites: {} }), false);
});
