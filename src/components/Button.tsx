import { ReactNode } from 'react'
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native'

type Props = {
    children: ReactNode
    onPress?: () => void
    variant?: 'primary' | 'danger' | 'default'
    style?: ViewStyle
}

export default function Button({ children, onPress, variant = 'default', style }: Props) {
    const bg = variant === 'primary' ? '#2563eb' : variant === 'danger' ? '#ef4444' : '#e5e7eb'
    const color = variant === 'default' ? '#0b0b0f' : '#ffffff'
    return (
        <Pressable onPress={onPress} style={[styles.btn, { backgroundColor: bg }, style]}>
            <Text style={[styles.text, { color }]}>{children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    text: { fontSize: 14, fontWeight: '600' },
})
