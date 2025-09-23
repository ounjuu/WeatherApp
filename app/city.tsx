// app/city.tsx
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function CityScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // Expo 환경변수 사용
  const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  console.log("API_KEY:", API_KEY);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      console.log("Weather data:", data);

      if (data.coord) {
        setLocation({ lat: data.coord.lat, lon: data.coord.lon });
      }
      setWeather(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>도시 검색</Text>
      <TextInput
        style={styles.input}
        placeholder="도시 이름을 입력하세요 (예: Seoul)"
        value={city}
        onChangeText={setCity}
      />
      <Button title="검색" onPress={fetchWeather} />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      )}

      {weather && (
        <View style={styles.info}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text>{weather.weather[0].description}</Text>
          <Text>{weather.main.temp}°C</Text>
        </View>
      )}

      {Platform.OS !== "web" && location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.lat || 37.5665,
            longitude: location.lon || 126.978,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lon }}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  info: { marginVertical: 16, alignItems: "center" },
  city: { fontSize: 20, fontWeight: "600" },
  map: { flex: 1, marginTop: 10 },
});
