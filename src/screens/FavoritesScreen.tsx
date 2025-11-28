import { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native'
import Card from '../components/Card'
import Button from '../components/Button'
import { Text } from '../components/Typography'
import type { TabsParamList } from '../navigation/AppNavigator'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { fetchPokemonDetail, getOfficialArtworkUrl } from '../services/pokeapi'
import { useFavorites } from '../store/favorites'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'

type Props = BottomTabScreenProps<TabsParamList, 'Favorites'>

export default function FavoritesScreen({ navigation }: Props) {
  const { favorites, ready, remove } = useFavorites()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState<string>('')
  const [items, setItems] = useState<{ name: string; id: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!ready) return
    if (favorites.length === 0) {
      setItems([])
      return
    }
    try {
      setLoading(true)
      setError(null)
      const results = await Promise.allSettled(
        favorites.map(async name => {
          const d = await fetchPokemonDetail(name)
          return { name: d.name, id: d.id }
        })
      )
      const ok = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<{ name: string; id: number }>).value)
      setItems(ok)
    } catch (e: any) {
      setError(e?.message ?? 'Gagal memuat favorit')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [ready, favorites])

  const onRefresh = () => {
    try {
      setRefreshing(true);
      load();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat favorit')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Header query={query} setQuery={setQuery} />
      {!ready || loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={query ? items.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())) : items}
          keyExtractor={it => String(it.id)}
          contentContainerStyle={styles.containerFavorites}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Image source={{ uri: getOfficialArtworkUrl(item.id) }} style={styles.thumb} />
                <View style={styles.col}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.actions}>
                    <Button onPress={() => navigation.navigate('PokemonDetail' as any, { name: item.name })}>
                      Detail
                    </Button>
                    <Button style={styles.ml} variant="danger" onPress={() => remove(item.name)}>
                      Hapus
                    </Button>
                  </View>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : (
                <Text>Tidak ada favorit</Text>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f5' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  col: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  ml: { marginLeft: 8 },
  thumb: { width: 72, height: 72 },
  containerFavorites: { padding: 10, paddingBottom: 100 },
  error: { color: 'red' },
})
