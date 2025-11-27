import Ionicons, { IoniconsIconName } from "@react-native-vector-icons/ionicons"
import { Pressable, StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated"
import { Text } from "./Typography"

type TabButtonProps = {
    onPress: () => void
    onLongPress: any
    routeName: string
    isFocused: boolean
}

export default function TabButton({ onPress, onLongPress, routeName, isFocused }: TabButtonProps) {
    const scale = useSharedValue(1)

    const handlePress = () => {
        scale.value = withSequence(
            withSpring(1.2, { damping: 100 }),
            withSpring(1, { damping: 10 })
        )

        onPress()
    }

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    })

    const getIconName = (name: string): IoniconsIconName => {
        switch (name) {
            case 'Pokedex':
                return 'albums'
            case 'Favorites':
                return 'heart'
            default:
                return 'search'
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            onLongPress={onLongPress}
            style={styles.tabButton}
        >
            <Animated.View style={[animatedIconStyle]}>
                <Ionicons name={getIconName(routeName)} size={26} color={isFocused ? '#1097c4ff' : '#011b36ff'} />
            </Animated.View>
            <Text style={[styles.label, { color: isFocused ? '#1097c4ff' : '#011b36ff' }]}>{routeName}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
    },
    label: {
        fontSize: 14
    }
});
