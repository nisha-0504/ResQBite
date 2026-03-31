import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DonationDetailsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>

      {/* IMAGE + BACK */}
      <View>
        <Image
        source={{
  uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
}}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        {/* Title */}
        <View style={styles.row}>
          <Text style={styles.title}>Veg Meals</Text>
          <View style={styles.status}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>

        <Text style={styles.qty}>40 packets</Text>

        {/* Pickup Time */}
        <View style={styles.card}>
          <Ionicons name="time-outline" size={18} color="#2ECC71" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Pickup Time</Text>
            <Text style={styles.value}>9:00 PM Today</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Ionicons name="location-outline" size={18} color="#2ECC71" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.value}>
              123 Main Street, Food Plaza
            </Text>
          </View>
        </View>

        {/* Volunteer */}
        <View style={styles.volunteerCard}>
          <Text style={styles.sectionTitle}>Assigned Volunteer</Text>

          <View style={styles.volunteerRow}>
            <View style={styles.avatar}>
              <Text style={{ color: 'white' }}>R</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Raj Kumar</Text>
              <Text style={{ color: '#6B7280' }}>⭐ 4.8 Rating</Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={{ color: '#2ECC71' }}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.trackBtn}>
              <Text style={{ color: 'white' }}>Track</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Track on Map */}
        <TouchableOpacity style={styles.mapBtn}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Track on Map
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  image: {
    width: '100%',
    height: 200,
  },

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
  },

  content: {
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  status: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: '#CA8A04',
  },

  qty: {
    color: '#6B7280',
    marginTop: 5,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
  },

  value: {
    fontWeight: 'bold',
  },

  volunteerCard: {
    backgroundColor: '#ECFDF5',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  volunteerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },

  callBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2ECC71',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  trackBtn: {
    flex: 1,
    backgroundColor: '#2ECC71',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  mapBtn: {
    backgroundColor: '#F58634',
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});