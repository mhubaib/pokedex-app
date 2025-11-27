import { useCallback } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring } from 'react-native-reanimated'

type Props = {
  active: boolean
  onToggle: () => void
  size?: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FavoriteButton({ active, onToggle, size = 24 }: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(() => {
    scale.value = withSequence(withSpring(1.2), withSpring(1))
    onToggle()
  }, [onToggle, scale])

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.pressable, animatedStyle]}>
        <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? '#ef4444' : '#9ca3af'} />
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  pressable: { paddingHorizontal: 4, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
})
