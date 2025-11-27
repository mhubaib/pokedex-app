import axios from 'axios'

const API_BASE = 'https://pokeapi.co/api/v2'

export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export type PokemonType = { type: { name: string } }

export type PokemonStat = { stat: { name: string }; base_stat: number }

export type PokemonDetail = {
  id: number
  name: string
  sprites: any
  types: PokemonType[]
  stats: PokemonStat[]
}

export async function fetchPokemonList(limit = 20, offset = 0) {
  const url = `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`
  const { data } = await axios.get<PokemonListResponse>(url)
  return data
}

export async function fetchPokemonDetail(nameOrId: string | number) {
  const url = `${API_BASE}/pokemon/${nameOrId}`
  const { data } = await axios.get<PokemonDetail>(url)
  return data
}

export function getOfficialArtworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

