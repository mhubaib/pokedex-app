import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import PokemonListScreen from '../screens/PokemonListScreen'
import PokemonDetailScreen from '../screens/PokemonDetailScreen'
import FavoritesScreen from '../screens/FavoritesScreen'
import Ionicons from '@react-native-vector-icons/ionicons'

export type RootStackParamList = {
  Tabs: undefined
  PokemonDetail: { name: string }
}

export type TabsParamList = {
  Pokedex: undefined
  Favorites: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabsParamList>()

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Pokedex' ? 'list' : 'heart'
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Pokedex" component={PokemonListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={({ route }) => ({ title: route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1) })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
