import { Text as RNText, StyleSheet, TextProps } from 'react-native'

export function Title(props: TextProps) {
  return <RNText {...props} style={[styles.title, props.style]} />
}

export function Text(props: TextProps) {
  return <RNText {...props} style={[styles.text, props.style]} />
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#0b0b0f' },
  text: { fontSize: 16, color: '#0b0b0f' },
})
