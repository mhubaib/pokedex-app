import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

export default function Card({ children }: Props) {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.card}>
            {children}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
})
