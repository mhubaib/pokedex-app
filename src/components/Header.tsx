import { Image, StyleSheet, View } from "react-native";
import Input from "./Input";

export default function Header({ query, setQuery }: { query: string, setQuery: any }) {
    return (
        <View style={styles.headerRow}>
            <Image source={require('../assets/logo.jpg')} style={styles.logo} />
            <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Cari Pokémon"
                containerStyle={styles.search}
                autoCorrect={false}
                autoCapitalize="none"
                icon='search'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    logo: { width: 50, height: 50 },
    search: { flex: 1, marginLeft: 12 },
})