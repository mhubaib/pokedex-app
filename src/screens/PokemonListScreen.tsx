import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Image, StyleSheet, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import Button from '../components/Button'
import FavoriteButton from '../components/FavoriteButton'
import { Text } from '../components/Typography'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { TabsParamList } from '../navigation/AppNavigator'
import { fetchPokemonList, getOfficialArtworkUrl, PokemonListItem, fetchTypes, fetchPokemonByType } from '../services/pokeapi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFavorites } from '../store/favorites'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import HeaderList from '../components/HeaderList'

type Props = BottomTabScreenProps<TabsParamList, 'Pokedex'>

function getIdFromUrl(url: string) {
  const parts = url.split('/').filter(Boolean)
  const idStr = parts[parts.length - 1]
  return Number(idStr)
}

export default function PokemonListScreen({ navigation }: Props) {
  const [items, setItems] = useState<PokemonListItem[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { favorites, toggle } = useFavorites()
  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      setError(null)
      let batch: PokemonListItem[] = []
      if (!selectedType) {
        const data = await fetchPokemonList(20, offset)
        batch = data.results
      } else {
        const all = await fetchPokemonByType(selectedType)
        batch = all.slice(offset, offset + 20)
        if (offset + 20 >= all.length) setHasMore(false)
      }
      setItems(prev => {
        const merged = [...prev, ...batch]
        const map = new Map<string, PokemonListItem>()
        for (const it of merged) map.set(it.name, it)
        const next = Array.from(map.values())
        return next
      })
      await AsyncStorage.setItem('last_pokemon_list', JSON.stringify(items.length ? items : batch))
      setOffset(o => o + 20)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load Pokémon')
      if (items.length === 0) {
        const cached = await AsyncStorage.getItem('last_pokemon_list')
        if (cached) {
          try {
            const arr: PokemonListItem[] = JSON.parse(cached)
            if (Array.isArray(arr)) setItems(arr)
          } catch { }
        }
      }
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, offset, items, selectedType])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    fetchTypes().then(setTypes).catch(() => setTypes(['fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']))
  }, [])

  useEffect(() => {
    setItems([])
    setOffset(0)
    setHasMore(true)
    setError(null)
    load()
  }, [selectedType, load])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setError(null)
      setHasMore(true)
      setOffset(0)
      const data = await fetchPokemonList(20, 0)
      setItems(data.results)
      await AsyncStorage.setItem('last_pokemon_list', JSON.stringify(data.results))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to refresh')
      const cached = await AsyncStorage.getItem('last_pokemon_list')
      if (cached) {
        try {
          const arr: PokemonListItem[] = JSON.parse(cached)
          if (Array.isArray(arr)) setItems(arr)
        } catch { }
      }
    } finally {
      setRefreshing(false)
    }
  }, [])

  const renderItem = useCallback(({ item }: { item: PokemonListItem }) => {
    const id = getIdFromUrl(item.url)
    const image = getOfficialArtworkUrl(id)
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate('PokemonDetail' as any, { name: item.name })}
      >
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton
            active={favorites.includes(item.name)}
            onToggle={() => toggle(item.name)}
            size={24}
          />
        </View>
        <Image
          source={{ uri: image }}
          style={styles.thumb}
          resizeMode="contain"
        />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    )
  }, [navigation, favorites, toggle])

  const ListFooter = useMemo(() => (
    <View style={styles.footer}>
      {loading && <ActivityIndicator size="large" />}
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={load}>Coba Lagi</Button>
        </View>
      )}
    </View>
  ), [loading, error, load])

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Header query={query} setQuery={setQuery} />
      <FlatList
        data={query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase())) : items}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderItem={renderItem}
        keyExtractor={(item) => String(getIdFromUrl(item.url))}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
        onEndReached={() => load()}
        ListHeaderComponent={<HeaderList categories={types} selected={selectedType} onSelect={setSelectedType} />}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumb: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#333333',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  errorBox: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
});
