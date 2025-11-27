import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Image, StyleSheet, View, ActivityIndicator } from 'react-native'
import Card from '../components/Card'
import Button from '../components/Button'
import { Title, Text } from '../components/Typography'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { TabsParamList } from '../navigation/AppNavigator'
import { fetchPokemonList, getOfficialArtworkUrl, PokemonListItem } from '../services/pokeapi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFavorites } from '../store/favorites'
import { SafeAreaView } from 'react-native-safe-area-context'

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
  const { favorites, toggle } = useFavorites()

  const load = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPokemonList(20, offset)
      setItems(prev => {
        const merged = [...prev, ...data.results]
        const map = new Map<string, PokemonListItem>()
        for (const it of merged) map.set(it.name, it)
        const next = Array.from(map.values())
        return next
      })
      await AsyncStorage.setItem('last_pokemon_list', JSON.stringify(items.length ? items : data.results))
      if (data.next) {
        setOffset(o => o + 20)
      } else {
        setHasMore(false)
      }
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
  }, [loading, hasMore, offset, items])

  useEffect(() => {
    load()
  }, [])

  const renderItem = useCallback(({ item }: { item: PokemonListItem }) => {
    const id = getIdFromUrl(item.url)
    const image = getOfficialArtworkUrl(id)
    return (
      <Card>
        <View style={styles.row}>
          <Image source={{ uri: image }} style={styles.thumb} resizeMode="contain" />
          <View style={styles.col}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.actions}>
              <Button variant="danger" onPress={() => navigation.navigate('PokemonDetail' as any, { name: item.name })}>
                Detail
              </Button>
              <Button style={styles.ml} onPress={() => toggle(item.name)}>
                {favorites.includes(item.name) ? 'Favorit' : 'Tambah'}
              </Button>
            </View>
          </View>
        </View>
      </Card>
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
      <View style={styles.header}>
        <Title>Pokédex</Title>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(getIdFromUrl(item.url))}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
        onEndReached={() => load()}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f5' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  col: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  ml: { marginLeft: 8 },
  thumb: { width: 72, height: 72 },
  listContent: { paddingBottom: 16 },
  footer: { padding: 16, alignItems: 'center' },
  errorBox: { marginTop: 8, alignItems: 'center' },
  errorText: { color: '#ef4444', marginBottom: 8 },
})
