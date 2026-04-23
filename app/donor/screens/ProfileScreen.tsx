import { MaterialIcons } from "@expo/vector-icons";
import React from 'react';
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
export default function ProfileScreen() {
  const router = useRouter();
  const handleLogout = async () => {
  try {
    // 🧹 Clear stored data (role, token, etc.)
    await AsyncStorage.clear();

    // 🔄 Navigate to role selection
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
            <Text style={styles.avatarText}>R</Text>
          </View>

          {/* Edit Icon */}
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={14} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Restaurant ABC</Text>
        <Text style={styles.role}>Donor</Text>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        <InfoRow icon="mail" title="Email" value="restaurant@abc.com" />
        <InfoRow icon="call" title="Phone" value="+91 98765 43210" />
        <InfoRow icon="location" title="Location" value="123 Main Street, Food Plaza" />
      </View>

      {/* IMPACT */}
      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact</Text>

        <View style={styles.impactRow}>
          <ImpactItem value="150" label="Meals" />
          <ImpactItem value="45kg" label="Food Saved" />
          <ImpactItem value="120" label="People" />
        </View>
      </View>

      {/* BADGES */}
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
      
<TouchableOpacity
  style={styles.logout}
  onPress={() => router.replace("/role")}  // ✅ IMPORTANT
>
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

/* 🎨 Styles */

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

  avatarContainer: {
    position: 'relative',
  },

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