import { ReactNode } from 'react'
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native'
import FontAwesome, { FontAwesomeIconName } from '@react-native-vector-icons/fontawesome'

type Props = TextInputProps & {
  containerStyle?: any
  icon?: FontAwesomeIconName
}

export default function Input({ containerStyle, style, icon, ...rest }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && (
        <FontAwesome name={icon} size={16} color="#9ca3af" />
      )}
      <TextInput
        placeholderTextColor="#9ca3af"
        {...rest}
        style={[styles.input, style]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    gap: 4
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0b0b0f',
  },
})

