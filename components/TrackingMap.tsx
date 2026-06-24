import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

interface TrackingMapProps {
  donationId?: string;
}

interface Coords {
  latitude: number;
  longitude: number;
}

export default function TrackingMap({ donationId }: TrackingMapProps) {
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<any>(null);
  const [donorCoords, setDonorCoords] = useState<Coords | null>(null);
  const [ngoCoords, setNgoCoords] = useState<Coords | null>(null);
  const [deviceCoords, setDeviceCoords] = useState<Coords | null>(null);

  // Load donation and geocode addresses
  useEffect(() => {
    const fetchDataAndGeocode = async () => {
      try {
        // 1. Get user role to select correct API path
        const userStr = await AsyncStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const role = user?.role || "ngo";

        // 2. Fetch donation details
        if (donationId) {
          const apiPath = role === "donor" 
            ? `/donor/donations/${donationId}` 
            : `/ngo/donations/${donationId}`;
          const res = await API.get(apiPath);
          const donationData = res.data;
          setDonation(donationData);

          // 3. Geocode Donor Location
          if (donationData.location) {
            try {
              const geocode = await Location.geocodeAsync(donationData.location);
              if (geocode.length > 0) {
                setDonorCoords({
                  latitude: geocode[0].latitude,
                  longitude: geocode[0].longitude,
                });
              }
            } catch (e) {
              console.log("Geocoding donor address failed:", e);
            }
          }

          // 4. Geocode NGO Location
          const ngoAddress = donationData.ngoId?.address;
          if (ngoAddress && ngoAddress !== "Not Added") {
            try {
              const geocode = await Location.geocodeAsync(ngoAddress);
              if (geocode.length > 0) {
                setNgoCoords({
                  latitude: geocode[0].latitude,
                  longitude: geocode[0].longitude,
                });
              }
            } catch (e) {
              console.log("Geocoding NGO address failed:", e);
            }
          }
        }
      } catch (err) {
        console.log("Error loading tracking map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndGeocode();
  }, [donationId]);

  // Load current device coordinates
  useEffect(() => {
    const getDeviceLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setDeviceCoords(loc.coords);
        }
      } catch (e) {
        console.log("Error getting device location:", e);
      }
    };
    getDeviceLocation();
  }, []);

  // Distance calculator helper (Haversine formula in km)
  const haversineDistance = (c1: Coords | null, c2: Coords | null) => {
    if (!c1 || !c2) return null;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(c2.latitude - c1.latitude);
    const dLon = toRad(c2.longitude - c1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(c1.latitude)) *
        Math.cos(toRad(c2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getVolunteerCoords = (): Coords | null => {
    if (donation?.volunteerLatitude && donation?.volunteerLongitude) {
      return {
        latitude: donation.volunteerLatitude,
        longitude: donation.volunteerLongitude,
      };
    }
    return null;
  };

  // Determine current active route distance & status texts
  const getTrackingStatusInfo = () => {
    const vol = getVolunteerCoords();
    const status = donation?.status || "pending";

    if (status === "completed") {
      return {
        title: "Delivered successfully! 🎉",
        subtitle: "The food donation has reached the destination.",
        distanceText: "Route completed",
        info: "Thank you for rescuing food!",
      };
    }

    if (status === "picked") {
      const dist = haversineDistance(vol, ngoCoords);
      const distStr = dist !== null ? `${dist.toFixed(2)} km` : "N/A";
      return {
        title: "Delivering to NGO 🚴",
        subtitle: "Volunteer has picked up the food and is en route.",
        distanceText: `Distance to drop-off: ${distStr}`,
        info: `NGO: ${donation?.ngo || "NGO"}`,
      };
    }

    if (status === "assigned") {
      const dist = haversineDistance(vol, donorCoords);
      const distStr = dist !== null ? `${dist.toFixed(2)} km` : "N/A";
      return {
        title: "Heading to pickup 📍",
        subtitle: "Volunteer accepted the task and is going to the donor.",
        distanceText: `Distance to pickup: ${distStr}`,
        info: `Donor: ${donation?.restaurant || "Restaurant"}`,
      };
    }

    if (status === "accepted") {
      const dist = haversineDistance(donorCoords, ngoCoords);
      const distStr = dist !== null ? `${dist.toFixed(2)} km` : "N/A";
      return {
        title: "NGO Claimed donation 🤝",
        subtitle: "Awaiting volunteer assignment.",
        distanceText: `Total Route: ${distStr}`,
        info: "We're matching a volunteer to complete delivery.",
      };
    }

    // fallback
    const dist = haversineDistance(donorCoords, ngoCoords);
    const distStr = dist !== null ? `${dist.toFixed(2)} km` : "N/A";
    return {
      title: "Donation Pending ⏳",
      subtitle: "Awaiting NGO acceptance.",
      distanceText: `Route distance: ${distStr}`,
      info: "Waiting to be claimed.",
    };
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2ECC71" />
        <Text style={styles.loaderText}>Loading tracking map...</Text>
      </View>
    );
  }

  // Get active coordinates for map rendering
  const volCoords = getVolunteerCoords();
  
  // Decide center region of the map
  const mapCenter = volCoords ?? donorCoords ?? ngoCoords ?? deviceCoords ?? { latitude: 20.5937, longitude: 78.9629 };

  const { title, subtitle, distanceText, info } = getTrackingStatusInfo();

  return (
    <View style={styles.container}>
      {/* 🗺️ MAPVIEW WITH AVAILABLE MARKERS (FAILSAFE DESIGN) */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: mapCenter.latitude,
          longitude: mapCenter.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Donor Marker */}
        {donorCoords && (
          <Marker
            coordinate={donorCoords}
            title={donation?.restaurant || "Donor (Pickup)"}
            description={donation?.location}
            pinColor="orange"
          />
        )}

        {/* NGO Marker */}
        {ngoCoords && (
          <Marker
            coordinate={ngoCoords}
            title={donation?.ngo || "NGO (Drop-off)"}
            description={donation?.ngoId?.address}
            pinColor="blue"
          />
        )}

        {/* Volunteer Marker */}
        {volCoords && (
          <Marker
            coordinate={volCoords}
            title="Volunteer 🚴"
            description="Latest GPS Location"
            pinColor="green"
          />
        )}

        {/* Device Marker */}
        {deviceCoords && (
          <Marker
            coordinate={deviceCoords}
            title="You"
            pinColor="red"
          />
        )}
      </MapView>

      {/* 📦 DATA-DRIVEN STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.distance}>{distanceText}</Text>
        <Text style={styles.info}>{info}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loaderText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 15,
  },
  card: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#4B5563",
  },
  distance: {
    marginTop: 10,
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
  info: {
    marginTop: 4,
    color: "#10B981",
    fontWeight: "500",
    fontSize: 13,
  },
});