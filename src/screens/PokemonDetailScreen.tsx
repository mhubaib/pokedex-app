import { useEffect, useState } from 'react'
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native'
import Card from '../components/Card'
import Button from '../components/Button'
import FavoriteButton from '../components/FavoriteButton'
import { Title, Text } from '../components/Typography'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/AppNavigator'
import { fetchPokemonDetail, getOfficialArtworkUrl, PokemonDetail } from '../services/pokeapi'
import { useFavorites } from '../store/favorites'

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>

export default function PokemonDetailScreen({ route }: Props) {
  const { name } = route.params
  const [data, setData] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { favorites, toggle } = useFavorites()

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchPokemonDetail(name)
      setData(res)
    } catch (e: any) {
      setError(e?.message ?? 'Gagal memuat detail Pokémon')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [name])

  if (loading) {
    return (
      <View style={styles.center}>y 
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}> 
        <Text style={styles.error}>{error}</Text>
        <Button onPress={load}>Coba Lagi</Button>
      </View>
    )
  }

  if (!data) return null

  const image = getOfficialArtworkUrl(data.id)

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Title style={styles.capitalize}>{data.name}</Title>
      </View>
      <View style={styles.content}>
        <Card>
          <Image source={{ uri: image }} style={styles.art} />
          <View style={styles.typesRow}>
            {data.types.map((t, i) => (
              <View key={`${t.type.name}-${i}`} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.favoriteWrap}>
            <FavoriteButton active={favorites.includes(data.name)} onToggle={() => toggle(data.name)} size={28} />
          </View>
        </Card>

        <Card>
          <Title style={styles.sectionTitle}>Base Stats</Title>
          <View>
            {data.stats.map(s => (
              <View key={s.stat.name} style={styles.statRow}>
                <Text>{s.stat.name}</Text>
                <Text style={styles.statValue}>{s.base_stat}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f5' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  content: { paddingHorizontal: 16, gap: 12 },
  art: { width: 200, height: 200, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444', marginBottom: 8 },
  typesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  typeBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginHorizontal: 4, marginVertical: 2 },
  typeText: { color: '#fff' },
  mt: { marginTop: 12 },
  sectionTitle: { fontSize: 18 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  statValue: { fontWeight: '700' },
  favoriteWrap: { marginTop: 12, alignItems: 'center' },
})
