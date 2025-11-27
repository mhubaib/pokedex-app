import { use, useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, View, ActivityIndicator } from 'react-native'
import Card from '../components/Card'
import Button from '../components/Button'
import { Title, Text } from '../components/Typography'
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
  const [query, setQuery] = useState<string>('')
  const [items, setItems] = useState<{ name: string; id: number }[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await Promise.all(
          favorites.map(async name => {
            const d = await fetchPokemonDetail(name)
            return { name: d.name, id: d.id }
          })
        )
        setItems(res)
      } finally {
        setLoading(false)
      }
    }
    if (ready) load()
  }, [ready, favorites])

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
})
