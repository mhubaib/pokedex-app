import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import PokemonListScreen from '../screens/PokemonListScreen'
import PokemonDetailScreen from '../screens/PokemonDetailScreen'
import FavoritesScreen from '../screens/FavoritesScreen'
import CustomTabBar from '../components/BottomBar'

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

const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />

function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Pokedex" component={PokemonListScreen} options={{ tabBarLabel: 'Pokedex' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: 'Favorites' }} />
    </Tab.Navigator >
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
