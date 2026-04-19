import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function TrackingMap() {
  const [location, setLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);

  const markerRef = useRef<any>(null);

  // 📍 Get user location
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  // 📏 Distance calculation
  const calculateDistance = () => {
    if (!deliveryLocation || !location) return 0;

    const dx = deliveryLocation.latitude - location.latitude;
    const dy = deliveryLocation.longitude - location.longitude;

    return Math.sqrt(dx * dx + dy * dy);
  };

  // 📐 Format distance nicely
  const formatDistance = () => {
    const dist = calculateDistance();
    const km = dist * 111;

    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    } else {
      return `${km.toFixed(1)} km`;
    }
  };

  // 📊 Status logic
  const getStatus = () => {
    const dist = calculateDistance();

    if (dist < 0.0003) return "Arriving now 🚚";
    if (dist < 0.001) return "Almost there ⏳";
    return "On the way 📍";
  };

  // 🚚 Smooth movement
  useEffect(() => {
    let interval: any;

    if (location) {
      const start = {
        latitude: location.latitude + 0.002,
        longitude: location.longitude + 0.002,
      };

      setDeliveryLocation(start);

      interval = setInterval(() => {
        setDeliveryLocation((prev: any) => {
          if (!prev) return prev;

          const dx = Math.abs(prev.latitude - location.latitude);
          const dy = Math.abs(prev.longitude - location.longitude);

          // stop near destination
          if (dx < 0.0002 && dy < 0.0002) {
            return prev;
          }

          const newLat = prev.latitude - 0.0001;
          const newLng = prev.longitude - 0.0001;

          // ✨ smooth animation
          if (markerRef.current) {
            markerRef.current.animateMarkerToCoordinate(
              {
                latitude: newLat,
                longitude: newLng,
              },
              1500
            );
          }

          return {
            latitude: newLat,
            longitude: newLng,
          };
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [location]);

  // ⏳ Loading
  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 🗺️ MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 👤 User */}
        <Marker
          coordinate={location}
          title="You are here"
          pinColor="green"
        />

        {/* 🚚 Delivery */}
        {deliveryLocation && (
          <Marker
            ref={markerRef}
            coordinate={deliveryLocation}
            title="Delivery Agent 🚚"
            pinColor="red"
          />
        )}
      </MapView>

      {/* 📦 STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Delivery in Progress 🚚</Text>

        <Text style={styles.subtitle}>{getStatus()}</Text>

        <Text style={styles.distance}>
          Distance: {formatDistance()}
        </Text>

        <Text style={styles.info}>
          Volunteer is moving towards you...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
  },

  subtitle: {
    marginTop: 5,
    fontWeight: "500",
    color: "#3B82F6",
  },

  distance: {
    marginTop: 8,
    color: "#22C55E",
    fontWeight: "500",
  },

  info: {
    marginTop: 5,
    color: "gray",
  },
});