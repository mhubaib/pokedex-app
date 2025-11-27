import { useEffect, useState } from 'react'
import { Image, StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native'
import Card from '../components/Card'
import Button from '../components/Button'
import FavoriteButton from '../components/FavoriteButton'
import { Title, Text } from '../components/Typography'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/AppNavigator'
import { fetchPokemonDetail, getOfficialArtworkUrl, PokemonDetail } from '../services/pokeapi'
import { useFavorites } from '../store/favorites'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      <View style={styles.center}>
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
  const typeColors: Record<string, string> = {
    fire: '#ef4444', water: '#3b82f6', grass: '#22c55e', electric: '#f59e0b',
    ice: '#06b6d4', fighting: '#ef4444', poison: '#8b5cf6', ground: '#f59e0b',
    flying: '#60a5fa', psychic: '#f472b6', bug: '#84cc16', rock: '#a3a3a3',
    ghost: '#6366f1', dragon: '#0ea5e9', dark: '#374151', steel: '#9ca3af', fairy: '#fb7185'
  }
  function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView>
        <LinearGradient colors={["#f87171", "#ef4444"]} style={styles.hero}>
          <Title style={styles.heroTitle}>{cap(data.name)}</Title>
          <Image source={{ uri: image }} style={styles.art} />
        </LinearGradient>
        <View style={styles.content}>
          <Card>
            <View style={styles.typesRow}>
              {data.types.map((t, i) => {
                const color = typeColors[t.type.name] ?? '#ef4444'
                return (
                  <View key={`${t.type.name}-${i}`} style={[styles.typeBadge, { backgroundColor: `${color}22` }]}>
                    <Text style={[styles.typeText, { color }]}>{cap(t.type.name)}</Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.favoriteWrap}>
              <FavoriteButton active={favorites.includes(data.name)} onToggle={() => toggle(data.name)} size={28} />
            </View>
          </Card>

          <Card>
            <Title style={styles.sectionTitle}>Base Stats</Title>
            <View>
              {data.stats.map(s => {
                const pct = Math.min(1, s.base_stat / 200)
                return (
                  <View key={s.stat.name} style={styles.statBlock}>
                    <View style={styles.statHeader}>
                      <Text>{cap(s.stat.name)}</Text>
                      <Text style={styles.statValue}>{s.base_stat}</Text>
                    </View>
                    <View style={styles.barBg}>
                      <Animated.View entering={FadeInDown} style={[styles.barFill, { width: `${pct * 100}%` }]} />
                    </View>
                  </View>
                )
              })}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f5' },
  hero: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12, alignItems: 'center' },
  heroTitle: { color: '#fff' },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#333333' },
  art: { width: 220, height: 220 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444', marginBottom: 8 },
  typesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginHorizontal: 4, marginVertical: 2 },
  typeText: { fontWeight: '700' },
  mt: { marginTop: 12 },
  sectionTitle: { fontSize: 18 },
  statBlock: { marginBottom: 8 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statValue: { fontWeight: '700' },
  barBg: { height: 10, backgroundColor: '#e5e7eb', borderRadius: 999, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: '#ef4444' },
  favoriteWrap: { marginTop: 12, alignItems: 'center' },
})
