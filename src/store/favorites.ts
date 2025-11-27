import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const KEY = 'favorites'

async function getFavorites(): Promise<string[]> {
  const json = await AsyncStorage.getItem(KEY)
  if (!json) return []
  try {
    const arr = JSON.parse(json)
    if (Array.isArray(arr)) return arr
    return []
  } catch {
    return []
  }
}

async function setFavorites(names: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(names))
}

type Listener = (names: string[]) => void
const listeners: Listener[] = []
function notify(names: string[]) {
  for (const l of listeners) l(names)
}
function subscribe(l: Listener) {
  listeners.push(l)
  return () => {
    const i = listeners.indexOf(l)
    if (i >= 0) listeners.splice(i, 1)
  }
}

export function useFavorites() {
  const [favorites, setFavoritesState] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getFavorites().then(arr => {
      setFavoritesState(arr)
      setReady(true)
    })
    const unsub = subscribe(setFavoritesState)
    return () => unsub()
  }, [])

  async function add(name: string) {
    const next = Array.from(new Set([...favorites, name]))
    setFavoritesState(next)
    await setFavorites(next)
    notify(next)
  }

  async function remove(name: string) {
    const next = favorites.filter(n => n !== name)
    setFavoritesState(next)
    await setFavorites(next)
    notify(next)
  }

  async function toggle(name: string) {
    if (favorites.includes(name)) await remove(name)
    else await add(name)
  }

  return { favorites, ready, add, remove, toggle }
}
