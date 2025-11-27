import { ScrollView, Text, StyleSheet, Pressable } from 'react-native'

type Props = {
  categories: string[]
  selected?: string | null
  onSelect: (name: string | null) => void
}

export default function HeaderList({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Chip label="All" active={!selected} onPress={() => onSelect(null)} />
      {categories.map(name => (
        <Chip key={name} label={capitalize(name)} active={selected === name} onPress={() => onSelect(name)} />
      ))}
    </ScrollView>
  )
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 8 },
  chip: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 4,
    marginVertical: 6,
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { color: '#0b0b0f', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
})

