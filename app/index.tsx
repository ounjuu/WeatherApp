// app/index.tsx
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "여기에_OpenWeatherMap_API_KEY";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {weather ? (
        <>
          <Text style={{ fontSize: 24 }}>{weather.name}</Text>
          <Text style={{ fontSize: 18 }}>{weather.weather[0].description}</Text>
          <Text style={{ fontSize: 18 }}>{weather.main.temp}°C</Text>
        </>
      ) : (
        <Text>날씨 정보를 불러올 수 없습니다.</Text>
      )}
    </View>
  );
}
