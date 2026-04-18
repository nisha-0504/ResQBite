import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function TrackingScreen() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission denied");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLoading(false);
  };

  // ⏳ While loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  // ❌ If no location
  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Unable to get location</Text>
      </View>
    );
  }

  // ✅ Main Map
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Your location */}
        <Marker coordinate={location} title="You" />

        {/* Dummy delivery partner */}
        <Marker
          coordinate={{
            latitude: location.latitude + 0.001,
            longitude: location.longitude + 0.001,
          }}
          title="Delivery Partner"
          pinColor="green"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});