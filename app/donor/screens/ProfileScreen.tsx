import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../../services/api"; // ✅ added

type User = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err: any) {
        console.log("PROFILE ERROR:", err?.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (e) {
      console.log('Logout error:', e);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {/* ✅ Dynamic initial */}
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>

          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={14} color="white" />
          </TouchableOpacity>
        </View>

        {/* ✅ Dynamic name */}
        <Text style={styles.name}>
          {user?.name || "Loading..."}
        </Text>

        {/* ✅ Dynamic role */}
        <Text style={styles.role}>
          {user?.role || "User"}
        </Text>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        {/* ✅ Dynamic email */}
        <InfoRow
          icon="mail"
          title="Email"
          value={user?.email || "Loading..."}
        />

        {/* (Keep these static if not in backend yet) */}
        <InfoRow icon="call" title="Phone" value="+91 98765 43210" />
        <InfoRow icon="location" title="Location" value="123 Main Street, Food Plaza" />
      </View>

      {/* IMPACT (unchanged) */}
      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact</Text>

        <View style={styles.impactRow}>
          <ImpactItem value="150" label="Meals" />
          <ImpactItem value="45kg" label="Food Saved" />
          <ImpactItem value="120" label="People" />
        </View>
      </View>

      {/* BADGES (unchanged) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>

        <View style={styles.badgesRow}>
          <Badge emoji="🌟" />
          <Badge emoji="🏆" />
          <Badge emoji="💚" />
          <Badge emoji="🎯" />
          <Badge emoji="👑" />
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <MaterialIcons name="logout" size={18} color="red" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* 🔹 Components */

function InfoRow({ icon, title, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={16} color="#2ECC71" />
      </View>

      <View>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ImpactItem({ value, label }: any) {
  return (
    <View style={styles.impactItem}>
      <Text style={styles.impactValue}>{value}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

function Badge({ emoji }: any) {
  return (
    <View style={styles.badge}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    </View>
  );
}

/* 🎨 Styles — EXACT SAME */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F58634',
    padding: 6,
    borderRadius: 20,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    color: 'white',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontWeight: '500',
  },
  impactCard: {
    backgroundColor: '#2ECC71',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
  },
  impactTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  impactLabel: {
    color: 'white',
    fontSize: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  logout: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
});