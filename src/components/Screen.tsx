import { ReactNode } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'

type Props = {
  children: ReactNode
}

export default function Screen({ children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f4f5' },
  container: { flex: 1, backgroundColor: '#f4f4f5' },
})
