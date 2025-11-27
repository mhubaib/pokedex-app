# Pokedex (React Native)

Proyek aplikasi Pokedex sederhana berbasis React Native dengan fokus Android. UI dibuat custom, animasi menggunakan React Native Reanimated, dan integrasi data dari PokeAPI.

## Fitur Utama

- Daftar Pokémon dengan gambar official artwork dari PokeAPI
- Pencarian cepat di header (`Cari Pokémon`)
- Filter berdasarkan kategori tipe (chip horizontal)
- Detail Pokémon dengan badge tipe dan grafik bar untuk base stats
- Favorit dengan tombol love beranimasi; sinkron real-time antar layar
- State persist menggunakan `AsyncStorage`

## Teknologi

- `react-native` 0.80, `react` 19
- `@react-navigation` (bottom tabs + native stack)
- `react-native-reanimated` untuk animasi
- `react-native-linear-gradient` untuk hero di detail
- `axios` untuk HTTP
- `@react-native-async-storage/async-storage` untuk persistensi
- `@react-native-vector-icons/ionicons` untuk ikon

## Struktur Proyek Singkat

```md
src/
  components/
    Button.tsx
    Card.tsx
    FavoriteButton.tsx
    Header.tsx
    HeaderList.tsx
    TabButton.tsx
  navigation/
    AppNavigator.tsx
  screens/
    PokemonListScreen.tsx
    PokemonDetailScreen.tsx
    FavoritesScreen.tsx
  services/
    pokeapi.ts
  store/
    favorites.ts
android/
  app/src/main/... (tema & bootsplash)
```

## Komponen & Layar

- `Header` menampilkan logo + input pencarian di List
- `HeaderList` chip horizontal untuk filter tipe
- `FavoriteButton` tombol love dengan animasi scale (Reanimated)
- `Card` wrapper dengan animasi `FadeIn/FadeOut`
- `PokemonListScreen` daftar + pencarian + filter tipe
- `PokemonDetailScreen` hero gradient, badge tipe, bar statistik teranimasi
- `FavoritesScreen` daftar favorit real-time, tombol hapus, navigasi ke detail

## State Favorit (Real-Time)

- Hook `useFavorites` menyimpan dan memuat dari `AsyncStorage`
- Broadcast sederhana dengan listener global agar semua layar tersinkron saat favorit berubah

## Pencarian & Filter

- Pencarian string di header men-filter data list
- Filter tipe menggunakan endpoint `type/{name}` PokeAPI, dipaginasi per 20 item

## Animasi

- `FavoriteButton`: animasi scale saat ditekan
- `Card`: `FadeIn/FadeOut`
- Detail: hero gradient + bar statistik dengan `FadeInDown`

## Bootsplash (Android)

- Latar bootsplash dikontrol `windowBackground` pada theme
- Opsi cepat: warna solid di `android/app/src/main/res/values/styles.xml`
- Opsi lengkap: `android/app/src/main/res/drawable/bootsplash.xml` dengan background + logo, set di `<item name="android:windowBackground">`

## Menjalankan Proyek

1. Persiapan
   - Node 18+
   - JDK 17, Android SDK (ADB), emulator/device
   - Instalasi paket: `npm install`
2. Development
   - Start Metro: `npm run start`
   - Android: `npm run android`
   - Reset cache (opsional): `npx react-native start --reset-cache`
3. Lint & Test
   - Lint: `npm run lint`
   - Test: `npm test`

## Konfigurasi yang Penting

- Navigasi tab kustom: `src/components/BottomBar.tsx` + `src/components/TabButton.tsx`
- Tema Android: `android/app/src/main/res/values/styles.xml`
- API Poke: `src/services/pokeapi.ts`

## Troubleshooting

- Metro cache: gunakan `--reset-cache` jika perubahan tidak muncul
- Duplicate key di `FlatList`: gunakan ID dari URL (`getIdFromUrl`) sebagai `keyExtractor`
- Icon tidak tampil: pastikan `react-native-vector-icons` sudah terhubung (auto-link di RN 0.80)
- Reanimated: pastikan Babel plugin Reanimated aktif secara default di RN 0.80 dan app direbuild jika terjadi error animasi

## Lisensi

Proyek ini untuk tujuan pembelajaran dan demonstrasi.
