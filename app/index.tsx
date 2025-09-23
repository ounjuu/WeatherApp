// app/index.tsx
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Expo 환경변수 사용
  const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  console.log("API_KEY:", API_KEY);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        console.log("Weather data:", data);
        setWeather(data);
      } catch (err) {
        console.error(err);
      }

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
