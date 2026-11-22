// Pokémon data shapes, guards and helpers.
import { hasShape, isArrayOf, isNumber, isRecord, isString } from "#shared/guards.js";

export const API = "https://pokeapi.co/api/v2";
export const PAGE_SIZE = 24;

export type NamedResource = { name: string; url: string };
export type PokemonPage = { count: number; results: NamedResource[] };

export type Pokemon = {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  types: Array<{ type: NamedResource }>;
  stats: Array<{ base_stat: number; stat: NamedResource }>;
  sprites: { front_default: string | null };
};

const isNamedResource = hasShape<NamedResource>({ name: isString, url: isString });

export const isPokemonPage = hasShape<PokemonPage>({ count: isNumber, results: isArrayOf(isNamedResource) });

export const isPokemon = hasShape<Pokemon>({
  id: isNumber,
  name: isString,
  height: isNumber,
  weight: isNumber,
  types: isArrayOf(hasShape<{ type: NamedResource }>({ type: isNamedResource })),
  stats: isArrayOf(hasShape<{ base_stat: number; stat: NamedResource }>({ base_stat: isNumber, stat: isNamedResource })),
  sprites: (value): value is Pokemon["sprites"] =>
    isRecord(value) && (value["front_default"] === null || isString(value["front_default"])),
});

/** ".../pokemon/25/" -> 25 */
export function idFromUrl(url: string): number | null {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : null;
}

export function pageUrl(page: number): string {
  return `${API}/pokemon?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`;
}

export function filterByName(items: readonly NamedResource[], query: string): NamedResource[] {
  const q = query.trim().toLowerCase();
  return q === "" ? [...items] : items.filter((item) => item.name.includes(q));
}

export function titleCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatBody(pokemon: Pick<Pokemon, "height" | "weight">): string {
  return `${(pokemon.height / 10).toFixed(1)} m · ${(pokemon.weight / 10).toFixed(1)} kg`;
}
